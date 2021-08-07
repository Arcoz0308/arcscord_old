// @ts-nocheck
import { WebSocketClient, StandardWebSocketClient} from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import {EventEmitter} from '../utils/EventEmitter';
export class WebSocket extends EventEmitter<{
    open: () => void;
    close: (code: number, reason: string) => void;
    message: (message: string) => void;
    ping: (body: any) => void;
    pong: (body: any) =>  void;
    error: (error: Error) => void;
}>{
    private _ws: WebSocketClient;
    constructor(endpoint: string) {
        super();
        this._ws = new StandardWebSocketClient(endpoint);
        this._ws.on('open', () => this.emit('open'));
        this._ws.on('close', (code, reason) => this.emit('close', code, reason));
        this._ws.on('message', (data) => this.emit('message', data as string));
        this._ws.on('ping', (data) => this.emit('ping', data));
        this._ws.on('pong', (data) => this.emit('pong', data));
        this._ws.on('error', (error) => this.emit('error', error));
    }
    send(message: string) {
        this._ws.send(message);
    }
    ping(message: string) {
        this._ws.ping(message);
    }
    close(code: number, reason?: string) {
        this._ws.close(code, reason);
    }
    get isOpen(): boolean {
        return !this.isClosed
    }
    get isClosed(): boolean {
        return !!this._ws.isClosed;
    }
}