import * as Ws from 'ws';
import { EventEmitter } from '../utils/EventEmitter';


export class AWebSocket extends EventEmitter<{
    open: () => void;
    close: (code: number, reason: string) => void;
    message: (message: string) => void;
    ping: (body: Buffer) => void;
    pong: (body: Buffer) => void;
    error: (error: Error) => void;
}> {
    private _ws: Ws;
    constructor(endpoint: string) {
        super();
        this._ws = new Ws(endpoint);
        this._ws = new Ws(endpoint);
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
    
    close(code?: number, reason?: string) {
        this._ws.close(code, reason);
    }
    
    get isOpen(): boolean {
        return this._ws.readyState === Ws.OPEN;
    }
    
    get isClosed(): boolean {
        return this._ws.readyState === Ws.CLOSED || this._ws.readyState === Ws.CLOSING;
    }
    
    get readyState(): 0 | 1 | 2 | 3 {
        return this._ws.readyState;
    }
}