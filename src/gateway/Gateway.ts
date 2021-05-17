import {Client} from "../Client";
import {API_VERSION} from "../Constants";
import {
    GatewayDispatchEvents,
    GatewayDispatchPayload,
    GatewayIdentifyData,
    GatewayOPCodes, GatewayPresenceUpdateData,
    GatewayReceivePayload
} from "discord-api-types";
import {Presence, ActivityType} from "../typing/discord-api-types";
export interface rawWSEvent {
    d: any;
    t: string
}
import WebSocket = require("ws");

export type GatewayStatus =
    'disconnected'|
    'connected'|
    'connecting...';
export class Gateway{
    private readonly _token: string;
    public ws?: WebSocket;
    public status: GatewayStatus = 'disconnected';
    public gatewayURL?: string;
    private readonly intents: number;
    public client: Client;


    public heartbeatInterval?: number;
    public lastSequence: number = 0;
    public latency: number = Infinity;
    public lastHeartbeatSend: number = Infinity;
    public lastHeartbeatReceive: number = Infinity;
    public lastHeartbeatAck: boolean = true;

    constructor(client: Client) {
        this._token = client.token;
        this.intents = client.intents;
        this.client = client;
    }
     identify() {
         const data: GatewayIdentifyData = {
             token: this._token,
             properties: {
                 $os: process.platform,
                 $device: 'arcscord',
                 $browser: 'arcscord'
             },
             compress: false,
             intents: this.intents,
         };
        if (this.client.presence) {

         const presence: { since: number|null, activities: any[]; afk: boolean; status: string } = {
             since: this.client.presence.since ? this.client.presence.since : null,
             status: this.client.presence.status,
             afk: !!this.client.presence.afk,
             activities: []
         }
         presence.activities.forEach(a => {
             if (a.type === "streaming") {
                 presence.activities.push({
                     name: a.name,
                     type: ActivityType.streaming,
                     url: a.url
                 })
             } else {
                 presence.activities.push({
                     name: a.name,
                     type: ActivityType[a.type]
                 })
             }
         });
         data.presence = presence as GatewayPresenceUpdateData;
        }
        this.sendWS(GatewayOPCodes.Identify, data);
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
        this.sendWS(GatewayOPCodes.Heartbeat, this.lastSequence);
    }
    public connect(gatewayURL: string) {
        if (this.ws && this.ws.readyState != WebSocket.CLOSED) {
            this.client.emit('error', new Error('the bot are already connect !'));
            return
        }
        if (gatewayURL.includes('?')) {
            gatewayURL = gatewayURL.substring(0, gatewayURL.indexOf('?'));
        }
        this.gatewayURL = gatewayURL;
        this.initWS();
    }

    public initWS() {
        this.status = 'connecting...';
        this.ws = new WebSocket(`${this.gatewayURL}?v${API_VERSION}&encoding=json`);
        this.ws.on('open', () => this.onWsOpen);
        this.ws.on('message', msg => this.onWsMessage(msg as string));
        this.ws.on('error', error => this.onWsError(error));
        this.ws.on('close', (code, raison) => this.onWsClose(code, raison));
    }
    private onWsOpen() {
        this.client.emit('connected');
    }
    public onWsMessage(message: string) {
        const msg: GatewayReceivePayload = JSON.parse(message) as GatewayReceivePayload;
        if (msg.s) this.lastSequence = msg.s;
        switch (msg.op) {
            case GatewayOPCodes.Hello:
                this.heartbeatInterval = msg.d.heartbeat_interval;
                this.identify();
                break;
            case GatewayOPCodes.Dispatch:
                this.handleEvent(msg);
                break;
            case GatewayOPCodes.HeartbeatAck:
                this.lastHeartbeatAck = true;
                this.lastHeartbeatReceive = Date.now();
                this.latency = this.lastHeartbeatSend - this.lastHeartbeatReceive;7
                break;
        }
    }
    public handleEvent(msg: GatewayDispatchPayload) {
        this.client.emit('rawWS', {
            t: msg.t,
            d: msg.d
        });
        switch (msg.t) {
            case GatewayDispatchEvents.Ready:
                this.client.emit('ready');
                return;
            case GatewayDispatchEvents.ChannelCreate:

        }
    }
    private onWsError(err: Error) {
    }
    private onWsClose(code: number, reason: string) {
    }
    public sendWS(code: GatewayOPCodes, data: any) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({op: code, d: data}));
    }
    public updatePresence(presence: Presence) {
        const data: { since: number|null, activities: any[]; afk: boolean; status: string } = {
            since: presence.since ? presence.since : null,
            status: presence.status,
            afk: !!presence.afk,
            activities: []
        }
        presence.activities.forEach(a => {
            if (a.type === "streaming") {
                data.activities.push({
                    name: a.name,
                    type: ActivityType.streaming,
                    url: a.url
                })
            } else {
                data.activities.push({
                    name: a.name,
                    type: ActivityType[a.type]
                })
            }
        });
        this.sendWS(GatewayOPCodes.PresenceUpdate, data);
    }
}