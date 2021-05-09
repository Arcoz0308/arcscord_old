import {Client} from "../Client";
import {EventEmitter} from "events";
import {API_VERSION} from "../Constants";
import {GatewayIdentifyData, GatewayOPCodes, GatewayReceivePayload} from "discord-api-types";
import WebSocket = require("ws");


export type GatewayStatus =
    'disconnected'|
    'connected'|
    'connecting...';
export class Gateway extends EventEmitter{
    private readonly _token: string;
    public ws?: WebSocket;
    public status: GatewayStatus = 'disconnected';
    public gatewayURL?: string;
    private readonly intents: number;
    public client: Client;
    public heartbeatInterval?: number;
    public lastSequence: number = 0;
    constructor(client: Client) {
        super();
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
            presence: this.client.presence
        }
        this.sendWS(GatewayOPCodes.Identify, data);
        setInterval(() => {
            this.sendWS(GatewayOPCodes.Heartbeat, this.lastSequence);
        }, this.heartbeatInterval);
    }
    public connect(gatewayURL: string) {
        if (this.ws && this.ws.readyState != WebSocket.CLOSED) {
            this.emit('error', new Error('the bot are already connect !'));
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
        this.emit('connected');
    }
    public onWsMessage(message: string) {
        const msg: GatewayReceivePayload = JSON.parse(message) as GatewayReceivePayload;
        if (msg.s) this.lastSequence = msg.s;
        if(msg.op === GatewayOPCodes.Hello) {
            this.heartbeatInterval = msg.d.heartbeat_interval;
            this.identify();
        }
    }
    private onWsError(err: Error) {
        console.log(err)
    }
    private onWsClose(code: number, reason: string) {
        console.log(reason)
    }
    public sendWS(code: GatewayOPCodes, data: any) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify({op: code, d: data}));
    }
}