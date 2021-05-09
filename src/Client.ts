import {EventEmitter} from "events";
import {GatewayIntentBits, GatewayPresenceUpdateData} from "discord-api-types";
import {Gateway} from "./gateway/Gateway";
import {RequestHandler} from "./requests/RequestHandler";
import {GATEWAY_CONNECT} from "./requests/EndPoints";
import {RequestError} from "./errors/Errors";

export const Intents = {
    GUILDS: 1,
    GUILD_MEMBERS: 2,
    GUILD_BANS: 4,
    GUILD_EMOJIS: 8,
    GUILD_INTEGRATIONS: 16,
    GUILD_WEBHOOKS: 32,
    GUILD_INVITES: 64,
    GUILD_VOICE_STATES: 128,
    GUILD_PRESENCES: 256,
    GUILD_MESSAGES: 512,
    GUILD_MESSAGE_REACTIONS: 1024,
    GUILD_MESSAGE_TYPING: 2048,
    DIRECT_MESSAGES: 4096,
    DIRECT_MESSAGE_REACTIONS: 8192,
    DIRECT_MESSAGE_TYPING: 16384
}
export interface BaseClientOptions {
    presence?: GatewayPresenceUpdateData;
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
    public presence?: GatewayPresenceUpdateData;
    public gateway: Gateway;
    public requestHandler: RequestHandler;
    constructor(token: string, options: ClientOptions) {
        super();
        this.token = 'Bot ' + token;
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
        this.presence = options.presence;

        this.gateway = new Gateway(this);
        this.requestHandler = new RequestHandler(this);
    }
    public connect() {
        this.requestHandler.request('GET', GATEWAY_CONNECT).then(r => {
            if (r instanceof RequestError) {
                if (r.status === '403') throw new Error('TOKEN ARE INVALID !');
                throw r;
            }
            let url: string = r.url;
            this.gateway.connect(url);
        })
    }

}