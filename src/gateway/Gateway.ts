import {
    GatewayDispatchEvents,
    GatewayDispatchPayload,
    GatewayIdentifyData,
    GatewayOpcodes,
    GatewayPresenceUpdateData,
    GatewayReceivePayload,
    GatewayResumeData
} from 'discord-api-types/v10';
import { CLOSED as wsCLOSED } from 'ws';
import { Client } from '../Client';
import { ActivityTypes, Presence } from '../structures';
import { GatewayAlreadyConnectedError } from '../utils/Errors';
import * as Actions from './eventHandlers';
import { AWebSocket } from './WebSocket';


interface EventHandlers {
    READY: Actions.READY;
}

export type GatewayStatus =
    'init...'
    | 'connecting...'
    | 'identifying...'
    | 'connected'
    | 'disconnected'
    | 'resuming...';

export class Gateway {
    public client: Client;
    public intents: number;
    public presence: Presence;
    public ws: AWebSocket | null = null;
    public gatewayURL: string = '';
    
    public eventHandlers!: EventHandlers;
    
    public heartbeatInterval?: NodeJS.Timer;
    public heartbeatACK: boolean = true;
    public lastHeartbeatSend: number = Infinity;
    public lastHeartbeatReceive: number = Infinity;
    public latency: number = Infinity;
    
    public status: GatewayStatus = 'init...';
    public seq: number = 0;
    public sessionId?: string;
    public resumeURL?: string;
    
    private readonly token: string;
    
    private connectTimeout?: NodeJS.Timer;
    private reconnectTime: number = 1000;
    
    private isResuming: boolean = false;
    private resumeTentatives: number = 0;
    
    constructor(client: Client) {
        this.client = client;
        this.token = client.token.startsWith('Bot ')
            ? client.token
            : 'Bot ' + client.token;
        this.intents = client.intents;
        this.presence = client.presence;
        this.loadEventHandlers();
    }
    
    public connect(url: string) {
        if (this.ws && this.ws.readyState !== wsCLOSED) {
            this.client.emit('error', new GatewayAlreadyConnectedError());
            return;
        }
        this.gatewayURL = url;
        this.initWS();
    }
    
    public disconnect(reconnect: boolean = false) {
        if (!this.ws || this.ws.readyState === wsCLOSED) {
            if (reconnect) {
                this.ws = null;
                this.initWS();
            }
            return;
        }
        if (this.sessionId && reconnect) this.isResuming = true;
        this.ws.close(3000, 'arcscord : ' + reconnect ? 'resume' : 'disconnect');
        this.ws = null;
        if (reconnect) {
            if (this.sessionId && this.resumeTentatives > 3) this.sessionId = undefined;
            if (this.sessionId) {
                this.isResuming = true;
                this.initWS();
            } else {
                this.isResuming = false;
                this.connectTimeout = setTimeout(() => {
                    this.initWS();
                }, this.reconnectTime);
                this.reconnectTime = Math.min(30000, Math.round(this.reconnectTime * (Math.random() + 1) * 2));
            }
        }
    }
    
    public updatePresence(presence: Presence) {
        const data = this.resolvePresence(presence);
        this.sendWS(GatewayOpcodes.PresenceUpdate, data);
    }
    
    private loadEventHandlers() {
        this.eventHandlers = {
            READY: new Actions.READY(this.client)
        };
    }
    
    private initWS() {
        this.status = this.isResuming ? 'resuming...' : 'connecting...';
        this.ws = new AWebSocket(this.isResuming && this.resumeURL ? this.resumeURL : this.gatewayURL);
        
        this.ws.on('open', () => this.onWSOpen());
        this.ws.on('message', (msg) => this.onWSMessage(msg));
        this.ws.on('error', (err) => this.onWSError(err));
        this.ws.on('close', (code, reason) => this.onWSClose(code, reason));
        
        this.connectTimeout = setTimeout(() => {
            if (this.status === 'resuming...' || this.status === 'connecting...') {
                this.disconnect(true);
            }
        }, this.client.connectTimeout);
    }
    
    private resume() {
        const data: GatewayResumeData = {
            token: this.token,
            seq: this.seq,
            session_id: this.sessionId!
        };
        this.sendWS(GatewayOpcodes.Resume, data);
    }
    
    private identify() {
        const data: GatewayIdentifyData = {
            token: this.token,
            properties: {
                os: process.platform,
                device: 'arcscord',
                browser: 'arcscord'
            },
            compress: false, //TODO add compress support
            intents: this.intents
        };
        if (this.client.presence) {
            const presence = this.resolvePresence(this.client.presence);
            data.presence = presence as GatewayPresenceUpdateData;
        }
        this.sendWS(GatewayOpcodes.Identify, data);
    }
    
    private heartbeat(normal: boolean = false) {
        if (this.status === 'resuming...' || this.status === 'identifying...') return;
        if (normal) {
            if (!this.heartbeatACK) {
                return this.disconnect(true);
            }
            this.heartbeatACK = false;
        }
        this.lastHeartbeatSend = Date.now();
        this.sendWS(GatewayOpcodes.Heartbeat, this.seq);
    }
    
    private handlePacket(msg: GatewayReceivePayload) {
        if (msg.s) this.seq = msg.s;
        this.client.emit('rawWS', msg);
        switch (msg.op) {
            case GatewayOpcodes.Dispatch:
                this.handleDispatchPacket(msg);
                break;
            case GatewayOpcodes.Heartbeat:
                this.heartbeat();
                break;
            case GatewayOpcodes.Reconnect:
                this.disconnect(true);
                break;
            case GatewayOpcodes.InvalidSession:
                this.isResuming = false;
                this.sessionId = undefined;
                this.identify();
                break;
            case GatewayOpcodes.Hello:
                if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
                this.heartbeatInterval = setInterval(() => {
                    if (this.status === 'connected') this.heartbeat(true);
                }, msg.d.heartbeat_interval);
                
                if (this.isResuming && this.sessionId) this.resume();
                else this.identify();
                break;
            case GatewayOpcodes.HeartbeatAck:
                this.heartbeatACK = true;
                this.lastHeartbeatReceive = Date.now();
                this.latency = this.lastHeartbeatReceive - this.lastHeartbeatSend;
                break;
        }
    }
    
    private handleDispatchPacket(msg: GatewayDispatchPayload) {
        switch (msg.t) {
            case GatewayDispatchEvents.Ready:
                this.status = 'connected';
                this.sessionId = msg.d.session_id;
                this.resumeURL = msg.d.resume_gateway_url;
                this.eventHandlers.READY.handle(msg.d);
                break;
            case GatewayDispatchEvents.Resumed:
                this.status = 'connected';
                this.isResuming = false;
                this.client.emit('resumed');
                break;
            
        }
    }
    
    public sendWS(code: GatewayOpcodes, data: any) {
        if (!this.ws || this.ws.isClosed) return;
        this.ws.send(JSON.stringify({ op: code, d: data }));
    }
    
    private onWSOpen() {
        if (this.isResuming) this.client.emit('reconnected');
        else this.client.emit('connected');
        if (this.status !== 'connected') this.status = 'identifying...';
    }
    
    private onWSMessage(message: string) {
        //TODO : compression support
        const msg: GatewayReceivePayload = JSON.parse(
            message
        ) as GatewayReceivePayload;
        this.handlePacket(msg);
    }
    
    private onWSError(err: Error) {
    
    }
    
    private onWSClose(code: number, raison: string) {
    
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
}