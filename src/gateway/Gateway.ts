import {
    APIUnavailableGuild,
    GatewayDispatchEvents,
    GatewayDispatchPayload,
    GatewayHelloData,
    GatewayIdentifyData,
    GatewayOpcodes,
    GatewayPresenceUpdateData,
    GatewayReceivePayload,
    GatewayResumeData
} from 'discord-api-types/v10';
import { Client } from '../Client';
import { API_VERSION } from '../Constants';
import { GUILD } from '../rest/EndPoints';
import { ActivityTypes, Guild, Presence } from '../structures';
import { GatewayAlreadyConnectedError } from '../utils/Errors';
import { platform } from '../utils/Platform';
import { Snowflake } from '../utils/Snowflake';
import * as ACTIONS from './actions';
import { AWebSocket } from './WebSocket';


export interface rawWSEvent {
    data: any;
    eventName: string;
}

interface Actions {
    READY?: ACTIONS.READY;
}

export type GatewayStatus =
    'disconnected'
    | 'connected'
    | 'connecting...'
    | 'resuming...';

export class Gateway {
    public ws?: AWebSocket;
    public status: GatewayStatus = 'disconnected';
    public gatewayURL?: string;
    public client: Client;
    public actions: Actions = {};
    public heartbeatInterval?: number;
    public seq: number = 0;
    private heartbeatTimer?: NodeJS.Timeout;
    public latency: number = Infinity;
    public lastHeartbeatSend: number = Infinity;
    public lastHeartbeatReceive: number = Infinity;
    public lastHeartbeatAck: boolean = true;
    private readonly _token: string;
    private readonly intents: number;
    private resumeGatewayURL?: string;
    private sessionId?: string;
    
    constructor(client: Client) {
        this._token = client.bot
            ? client.token.startsWith('Bot ')
                ? client.token
                : 'Bot ' + client.token
            : client.token;
        this.intents = client.intents;
        this.client = client;
        this.loadActions();
    }
    
    loadActions() {
        this.actions.READY = new ACTIONS.READY(this.client);
    }
    
    identify() {
        const data: GatewayIdentifyData = {
            token: this._token,
            properties: {
                os: platform,
                device: 'arcscord',
                browser: 'arcscord'
            },
            compress: false,
            intents: this.intents
        };
        if (this.client.presence) {
            const presence = this.resolvePresence(this.client.presence);
            data.presence = presence as GatewayPresenceUpdateData;
        }
        this.sendWS(GatewayOpcodes.Identify, data);
        this.heartbeatTimer = setInterval(() => {
            if (this.status === 'connected') this.heartbeat();
        }, this.heartbeatInterval);
    }
    
    public heartbeat() {
        if (!this.lastHeartbeatAck) {
            this.resume();
        }
        this.lastHeartbeatAck = false;
        this.lastHeartbeatSend = Date.now();
        this.sendWS(GatewayOpcodes.Heartbeat, this.seq);
    }
    
    public connect(gatewayURL: string) {
        if (this.ws && this.ws.isOpen) {
            this.client.emit('error', new GatewayAlreadyConnectedError());
            return;
        }
        if (gatewayURL.includes('?')) {
            gatewayURL = gatewayURL.substring(0, gatewayURL.indexOf('?'));
        }
        this.gatewayURL = gatewayURL;
        this.initWS();
    }
    
    public initWS() {
        this.status = 'connecting...';
        this.ws = new AWebSocket(
            `${this.gatewayURL}?v=${API_VERSION}&encoding=json`
        );
        this.ws.on('open', () => this.onWsOpen());
        this.ws.on('message', (msg) => this.onWsMessage(msg));
        this.ws.on('error', (error) => this.onWsError(error));
        this.ws.on('close', (code, raison) => this.onWsClose(code, raison));
    }
    
    public onWsMessage(message: string) {
        const msg: GatewayReceivePayload = JSON.parse(
            message
        ) as GatewayReceivePayload;
        switch (msg.op) {
            case GatewayOpcodes.Hello:
                this.lastHeartbeatAck = true;
                this.heartbeatInterval = (msg.d as GatewayHelloData).heartbeat_interval;
                if (this.sessionId) this.sendResume();
                else this.identify();
                break;
            case GatewayOpcodes.Dispatch:
                this.seq = msg.s;
                this.handleEvent(msg as GatewayDispatchPayload);
                break;
            case GatewayOpcodes.HeartbeatAck:
                this.lastHeartbeatAck = true;
                this.lastHeartbeatReceive = Date.now();
                this.latency = this.lastHeartbeatReceive - this.lastHeartbeatSend;
                break;
            case GatewayOpcodes.Reconnect:
                this.resume();
                break;
            case GatewayOpcodes.InvalidSession:
                throw new Error('invalid gateway session !');
        }
    }
    
    public handleEvent(msg: GatewayDispatchPayload) {
        this.client.emit('rawWS', {
            eventName: msg.t,
            data: msg.d
        });
        switch (msg.t) {
            case GatewayDispatchEvents.Ready:
                this.resumeGatewayURL = msg.d.resume_gateway_url;
                this.sessionId = msg.d.session_id;
                this.actions.READY!.handle(msg.d).then();
                break;
            case GatewayDispatchEvents.Resumed:
                this.client.emit('resumed');
                break;
            case GatewayDispatchEvents.MessageCreate:
        }
    }
    
    public sendWS(code: GatewayOpcodes, data: any) {
        if (!this.ws || this.ws.isClosed) return;
        this.ws.send(JSON.stringify({ op: code, d: data }));
    }
    
    public updatePresence(presence: Presence) {
        const data = this.resolvePresence(presence);
        
        this.sendWS(GatewayOpcodes.PresenceUpdate, data);
    }
    
    public resolvePresence(presence: Presence): any {
        const data: { activities: any[]; afk: boolean; status: string } = {
            status: presence.status || 'online',
            afk: !!presence.afk,
            activities: []
        };
        if (presence.activity) {
            if (presence.activity.type === 'streaming') {
                data.activities.push({
                    name: presence.activity.name,
                    type: ActivityTypes.streaming,
                    url: presence.activity.url
                });
            } else {
                data.activities.push({
                    name: presence.activity.name,
                    type: presence.activity.type
                        ? ActivityTypes[presence.activity.type]
                        : 0
                });
            }
        }
        return data;
    }
    
    public async createGuild(guild: APIUnavailableGuild) {
        const response = await this.client.requestHandler.request(
            'GET',
            GUILD(guild.id as Snowflake)
        );
        const g = new Guild(this.client, response);
        this.client.guilds.set(guild.id as Snowflake, g);
    }
    
    public resume() {
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
        if (this.ws && !this.ws.isClosed) this.ws.close(1009, 'arcscord : restart');
        this.status = 'resuming...';
        this.ws = new AWebSocket(`${this.resumeGatewayURL}?v=${API_VERSION}&encoding=json`);
        
        this.ws.on('open', () => this.onWsOpen());
        this.ws.on('message', (msg) => this.onWsMessage(msg));
        this.ws.on('error', (error) => this.onWsError(error));
        this.ws.on('close', (code, raison) => this.onWsClose(code, raison));
    }
    
    private sendResume() {
        this.heartbeatTimer = setInterval(() => {
            if (this.status === 'connected') this.heartbeat();
        }, this.heartbeatInterval);
        const data: GatewayResumeData = {
            token: this._token,
            seq: this.seq,
            session_id: this.sessionId!
        };
        this.sendWS(GatewayOpcodes.Resume, data);
    }
    
    private onWsOpen() {
        if (this.status === 'resuming...') {
            this.client.emit('reconnected');
        } else this.client.emit('connected');
        this.status = 'connected';
    }
    
    private onWsError(err: Error) {
    }
    
    private onWsClose(code: number, reason: string) {
        this.status = 'disconnected';
    }
}
