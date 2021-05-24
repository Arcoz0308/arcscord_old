import {GatewayDispatchEvents} from "discord-api-types";
import {Presence} from "./typing/Types"
import {Gateway, rawWSEvent} from "./gateway/Gateway";
import {RequestHandler} from "./requests/RequestHandler";
import {GATEWAY_CONNECT} from "./requests/EndPoints";
import {RequestError} from "./utils/Errors";
import {Intents} from './Constants'
import {EventEmitter} from "events";
import {ClientUser} from "./structures/ClientUser";
import {User} from "./structures/User";
import {Snowflake} from "./utils/Utils";
import {Guild} from "./structures/Guild"


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

    /**
     * fetch all members and users
     * @default false
     */
    fetchAllMembers?: boolean;

    /**
     * if the user is a bot
     * @default true
     */
    isABot?: boolean;
}

export declare interface Client {
    // on function
    /**
     * when bot are online
     */
    on(event: 'ready', listener: typeof ready): this;

    /**
     * when a gateway event are received
     */
    on(event: 'rawWS', listener: typeof rawWS): this;

    /**
     * when bot are connected to websocket
     */
    on(event: 'connected', listener: typeof connected): this;

    /**
     * when the websocket connection have a error
     */
    on(event: 'error', listener: typeof error): this;

    // emit function
    /**
     * when bot are online
     */
    emit(event: 'ready'): boolean;

    /**
     * when a gateway event are received
     */
    emit(event: 'rawWS', rawEvent: rawWSEvent): boolean;

    /**
     * when bot are connected to websocket
     */
    emit(event: 'connected'): boolean;

    /**
     * when the websocket connection have a error
     */
    emit(event: 'error', error: Error): boolean;
}

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
    public presence: Presence = {};
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
     * a user object of the bot
     */
    public user?: ClientUser;

    public fetchAllMembers: boolean;
    public bot: boolean;

    public users = new Map<Snowflake, User>();
    public guilds = new Map<Snowflake, Guild>();

    /**
     * @param token the token of the bot
     * @param options options of the bot
     */
    constructor(token: string, options: ClientOptions) {
        super();
        this.token = token;

        let intents = 32765;
        if (options.disableIntents) {
            for (const intent of options.disableIntents) {
                intents -= Intents[intent]
            }
        }
        this.intents = intents;

        this.disableEvents = options.disablesEvents;
        this.presence = options.presence ? options.presence : {};
        this.fetchAllMembers = !!options.fetchAllMembers;
        this.bot = typeof options.isABot === 'undefined' || options.isABot;

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

    onReady(): void {

    }

    /**
     * get bot ping (⚠ before the first heartbeat the ping are infinity)
     */
    get ping(): number {
        return this.gateway.latency;
    }
}

// events declaration for docs
/**
 * when bot are online
 * @asMemberOf Client
 * @event
 */
export declare function ready(): void;

/**
 * when a gateway event are received
 * @param packet a object of ws packets
 * @asMemberOf Client
 * @event
 */
export declare function rawWS(packet: rawWSEvent): void;

/**
 * when bot are connected to websocket
 * @asMemberOf Client
 * @event
 */
export declare function connected(): void;

/**
 * when the websocket connection have a error
 * @param error the error
 * @asMemberOf Client
 * @event
 */
export declare function error(error: Error): void;