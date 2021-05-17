import {GatewayDispatchEvents} from "discord-api-types";
import {Presence} from "./typing/discord-api-types"
import {Gateway, rawWSEvent} from "./gateway/Gateway";
import {RequestHandler} from "./requests/RequestHandler";
import {GATEWAY_CONNECT} from "./requests/EndPoints";
import {RequestError} from "./utils/Errors";
import {Intents} from './Constants'
import {EventEmitter} from "events";


export interface ClientOptions {
    /**
     * a object of presence
     */
    presence?: Presence
    /**
     * list of events that the client don't must emit
     */
    disablesEvents?: (keyof typeof GatewayDispatchEvents)[];
    /**
     * list of intents to disable [list-of-intents](https://discord.com/developers/docs/topics/gateway#list-of-intents)
     */
    disableIntents?: (keyof typeof Intents)[];
}

export declare interface Client {
    // on function
    on(event: 'ready', listener: () => void): this;
    on(event: 'rawWS', listener: (rawEvent: rawWSEvent) => void): this;
    on(event: 'connected', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;

    // emit function
    emit(event: 'ready'): boolean;
    emit(event: 'rawWS', rawEvent: rawWSEvent): boolean;
    emit(event: 'connected'): boolean;
    emit(event: 'error', error: Error): boolean;
}
/**
 * @class
 */
export class Client extends EventEmitter {
    /**
     * the token of the bot
     */
    public token: string;
    /**
     * int number for intents
     */
    public intents: number;
    /**
     * bot current presence
     */
    public presence?: Presence;
    /**
     * bot gateway
     */
    public gateway: Gateway;
    public requestHandler: RequestHandler;
    /**
     * list of events that the bot don't emit
     */
    public readonly disableEvents?: (keyof typeof GatewayDispatchEvents)[];

    /**
     * @param token the token of the bot
     * @param options options of the bot
     */
    constructor(token: string, options: ClientOptions) {
        super();
        this.token = token.startsWith("Bot ") ? token : "Bot " + token;

        let intents = 32765;
        if (options.disableIntents) {
            for (const intent of options.disableIntents) {
                intents -= Intents[intent]
            }
        }
        this.intents = intents;

        this.disableEvents = options.disablesEvents;
        this.presence = options.presence;

        this.gateway = new Gateway(this);
        this.requestHandler = new RequestHandler(this);
    }

    /**
     * connect the bot to discord
     */
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

    /**
     * update bot presence
     * @param presence a object of presence
     *
     * @example
     * ```typescript
     * client.setPresence({
     *     status: "dnd",
     *     activities: [{
     *         type: "Game",
     *         name: "on arcscord"
     *     }]
     * })
     * ```
     */
    public setPresence(presence?: Presence) {
        if (!presence) presence = this.presence;
        if (!presence) return;
        this.gateway.updatePresence(presence);
    }

}