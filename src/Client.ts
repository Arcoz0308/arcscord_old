import {EventEmitter} from "events";

import {GatewayIntentBits, GatewayDispatchEvents} from "discord-api-types";
import {AGatewayPresenceUpdateData} from "./typing/discord-api-types"
import {Gateway} from "./gateway/Gateway";
import {RequestHandler} from "./requests/RequestHandler";
import {GATEWAY_CONNECT} from "./requests/EndPoints";
import {RequestError} from "./utils/Errors";
import {Intents} from './Constants'
export type PresenceType = 'Online';
export interface Presence  {
    status: PresenceType;
    since?: number|null;
    activities: Activity[];
    afk?: boolean;
}
export interface Activity {

}
export interface BaseClientOptions {
    presence?: AGatewayPresenceUpdateData
    disablesEvents?: (keyof typeof GatewayDispatchEvents)[];
}
export type intents = keyof typeof GatewayIntentBits
export interface DisableIntentClientOptions extends BaseClientOptions{
    disableIntents: intents[];
}
export interface EnableIntentClientOptions extends BaseClientOptions{
    enableIntents: intents[];
}
export type ClientOptions = DisableIntentClientOptions | EnableIntentClientOptions;
export class Client extends EventEmitter {
    public token: string;
    public intents: number;
    public presence?: AGatewayPresenceUpdateData;
    public gateway: Gateway;
    public requestHandler: RequestHandler;
    public disableEvents?: (keyof typeof GatewayDispatchEvents)[];
    constructor(token: string, options: ClientOptions) {
        super();
        this.token = token.startsWith("Bot ") ? token : "Bot " + token;
        if ("enableIntents" in options) {
            let intents = 0;
            for (const intent of options.enableIntents) {
                intents |= Intents[intent];
            }
            this.intents = intents;
        } else {
            let intents = 32765;
            for (const intent of options.disableIntents) {
                intents -= Intents[intent]
            }
            this.intents = intents;
        }
        this.disableEvents = options.disablesEvents;
        this.presence = options.presence;

        this.gateway = new Gateway(this);
        this.requestHandler = new RequestHandler(this);
    }
    public connect(): Client {
        this.requestHandler.request('GET', GATEWAY_CONNECT).then(r => {
            if (r instanceof RequestError) {
                if (r.status === '403') throw new Error('TOKEN ARE INVALID !');
                throw r;
            }
            let url: string = r.url;
            this.gateway.connect(url);
        })
        return this;
    }
    public setPresence(presence?: AGatewayPresenceUpdateData) {
        if (!presence) presence = this.presence;
        if (!presence) return;
        this.gateway.updatePresence(presence);
    }

}