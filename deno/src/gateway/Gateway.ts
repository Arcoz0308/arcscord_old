import {
    APIUnavailableGuild,
    GatewayDispatchEvents,
    GatewayDispatchPayload,
    GatewayIdentifyData,
    GatewayOpcodes,
    GatewayPresenceUpdateData,
    GatewayReceivePayload,
    GatewayHelloData
} from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../Client.ts';
import { API_VERSION } from '../Constants.ts';
import { GUILD } from '../rest/EndPoints.ts';
import { ActivityTypes, Guild, Presence } from '../structures/mod.ts';
import { platform } from '../utils/Platform.ts';
import { Snowflake } from '../utils/Snowflake.ts';
import * as ACTIONS from './actions/mod.ts';
import { AWebSocket } from './WebSocket.ts';


export interface rawWSEvent {
    data: any;
    eventName: string;
}

interface Actions {
    READY?: ACTIONS.READY;
}

export type GatewayStatus = 'disconnected' | 'connected' | 'connecting...';

export class Gateway {
    public ws?: AWebSocket;
    public status: GatewayStatus = 'disconnected';
    public gatewayURL?: string;
    public client: Client;
    public actions: Actions = {};
    public heartbeatInterval?: number;
    public lastSequence: number = 0;
    public latency: number = Infinity;
    public lastHeartbeatSend: number = Infinity;
    public lastHeartbeatReceive: number = Infinity;
    public lastHeartbeatAck: boolean = true;
    private readonly _token: string;
    private readonly intents: number;
    
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
                $os: platform,
                $device: 'arcscord',
                $browser: 'arcscord'
            },
            compress: false,
            intents: this.intents
        };
        if (this.client.presence) {
            const presence = this.resolvePresence(this.client.presence);
            data.presence = presence as GatewayPresenceUpdateData;
        }
        this.sendWS(GatewayOpcodes.Identify, data);
        setInterval(() => {
            this.heartbeat();
        }, this.heartbeatInterval);
    }
    
    public heartbeat() {
        if (!this.lastHeartbeatAck) {
            //TODO reconnecting
        }
        this.lastHeartbeatAck = false;
        this.lastHeartbeatSend = Date.now();
        this.sendWS(GatewayOpcodes.Heartbeat, this.lastSequence);
    }
    
    public connect(gatewayURL: string) {
        if (this.ws && this.ws.isOpen) {
            this.client.emit('error', new Error('the bot is already connected!'));
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
        this.ws.on('open', () => this.onWsOpen);
        this.ws.on('message', (msg) => this.onWsMessage(msg));
        this.ws.on('error', (error) => this.onWsError(error));
        this.ws.on('close', (code, raison) => this.onWsClose(code, raison));
    }
    
    public onWsMessage(message: string) {
        const msg: GatewayReceivePayload = JSON.parse(
            message
        ) as GatewayReceivePayload;
        if (msg.s) this.lastSequence = msg.s;
        switch (msg.op) {
            case GatewayOpcodes.Hello:
                this.heartbeatInterval = (msg.d as GatewayHelloData).heartbeat_interval;
                this.identify();
                break;
            case GatewayOpcodes.Dispatch:
                this.handleEvent(msg as GatewayDispatchPayload).then();
                break;
            case GatewayOpcodes.HeartbeatAck:
                this.lastHeartbeatAck = true;
                this.lastHeartbeatReceive = Date.now();
                this.latency = this.lastHeartbeatReceive - this.lastHeartbeatSend;
                break;
        }
    }
    
    public async handleEvent(msg: GatewayDispatchPayload) {
        this.client.emit('rawWS', {
            eventName: msg.t,
            data: msg.d
        });
        switch (msg.t) {
            case GatewayDispatchEvents.Ready:
                this.heartbeat();
                this.actions.READY!.handle(msg.d).then();
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
    
    resolvePresence(presence: Presence): any {
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
    
    private onWsOpen() {
        this.client.emit('connected');
    }
    
    private onWsError(err: Error) {
    }
    
    private onWsClose(code: number, reason: string) {
    }
}
