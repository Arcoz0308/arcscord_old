import {EventEmitter} from '../utils/EventEmitter.ts';
export class AWebSocket extends EventEmitter<{
    open: () => void;
    close: (code: number, reason: string) => void;
    message: (message: string) => void;
    ping: (body: any) => void;
    pong: (body: any) =>  void;
    error: (error: Error) => void;
}>{
    private _ws: WebSocket;
    constructor(endpoint: string) {
        super();
        this._ws = new WebSocket(endpoint);
        this._ws.onmessage = (message) => {
            this.emit('message', message.data);
        }
        this._ws.onopen = () => this.emit('open');
        this._ws.onclose = (ev) => {
            this.emit('close', ev.code, ev.reason);
        }
        this._ws.onerror = (ev) => {
            this.emit('error', ev as any);
        }
    }
    send(message: string) {
        this._ws.send(message);
    }
    close(code: number, reason?: string) {
        this._ws.close(code, reason);
    }
    get isOpen(): boolean {
        return this._ws.readyState === WebSocket.OPEN;
    }
    get isClosed(): boolean {
        return this._ws.readyState === WebSocket.CLOSED || this._ws.readyState === WebSocket.CLOSING;
    }
}