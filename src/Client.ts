import { APIGuildMember, APIMessage, GatewayDispatchEvents } from 'discord-api-types';
import { Presence } from './typing/Types';
import { Gateway, rawWSEvent } from './gateway/Gateway';
import { RequestHandler } from './requests/RequestHandler';
import { APPLICATION_GLOBAL_COMMANDS, GATEWAY_CONNECT, GUILD, GUILD_MEMBERS, MESSAGES } from './requests/EndPoints';
import { RequestError } from './utils/Errors';
import { Intents } from './Constants';
import { EventEmitter } from 'events';
import { ClientUser } from './structures/ClientUser';
import { User } from './structures/User';
import { Snowflake } from './utils/Utils';
import { Guild } from './structures/Guild';
import { Member } from './structures/Member';
import { Message, MessageOptions, MessageOptionsWithContent } from './structures/Message';
import { Channel } from './structures/channels/Channel';
import { ApplicationCommand } from './structures/ApplicationCommand';

export interface ClientOptions {
    /**
     * a object of presence
     */
    presence?: Presence;
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
    /**
     * if the bot fetch self all slash commands
     * @default true
     */
    slashCommandByDefault?: boolean;
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

    on(event: 'warn', listener: typeof warn): this;

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

    emit(event: 'warn', error: Error): boolean;
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
    public channels = new Map<Snowflake, Channel>();
    public slashCommands = new Map<Snowflake, ApplicationCommand>();

    public unavailableGuilds: Snowflake[] = [];

    /**
     * @internal
     */
    public readonly slashCommand: boolean;

    /**
     * @param token the token of the bot
     * @param options options of the bot
     */
    constructor(token: string, options: ClientOptions = {}) {
        super();
        this.token = token;
        this.slashCommand =
            typeof options.slashCommandByDefault === 'undefined'
                ? true
                : options.slashCommandByDefault;
        let intents = 32765;
        if (options.disableIntents) {
            for (const intent of options.disableIntents) {
                intents -= Intents[intent];
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
     * get bot ping (⚠ before the first heartbeat the ping are infinity)
     */
    public get ping(): number {
        return this.gateway.latency;
    }

    /**
     * connect the bot to discord
     */
    public connect(): Client {
        this.requestHandler.request('GET', GATEWAY_CONNECT).then((r) => {
            if (r instanceof RequestError) {
                if (r.status === '403') throw new Error('TOKEN ARE INVALID !');
                throw r;
            }
            let url: string = r.url;
            this.gateway.connect(url);
        });
        return this;
    }

    public async fetchGuild(
        id: Snowflake,
        checkCache: boolean = true,
        setToCache: boolean = true
    ): Promise<Guild> {
        if (checkCache && this.guilds.has(id)) return this.guilds.get(id)!;
        const g = await this.requestHandler.request('GET', GUILD(id)).catch((e) => {
            return e;
        });
        const guild = new Guild(this, g);
        if (setToCache) this.guilds.set(id, guild);
        return guild;
    }

    public async fetchMembers(
        guildId: Snowflake,
        limit: number = 100,
        setToCache: boolean = true,
        after: number = 0
    ): Promise<Member[] | Error> {

        if (!this.guilds.get(guildId)) await this.fetchGuild(guildId);
        if (!this.guilds.get(guildId))
            return new Error('UNKNOWN ERROR on fetching members from ' + guildId);
        const r = (await this.requestHandler
            .request('GET', GUILD_MEMBERS(guildId, limit, after))
            .catch((e) => {
                return e;
            })) as APIGuildMember[];
        const members: Member[] = [];
        for (const m of r) {
            const member = new Member(this, this.guilds.get(guildId)!, m);
            members.push(member);
            if (setToCache) {
                this.users.set(member.user.id, member.user);
                this.guilds.get(guildId)!.members.set(member.user.id, member);
            }
        }
        return members;
    }

    public createMessage(
        channelId: Snowflake,
        content: string,
        msg?: MessageOptions
    ): Promise<Message>;
    public createMessage(
        channelId: Snowflake,
        msg: MessageOptionsWithContent
    ): Promise<Message>;
    public async createMessage(
        channelId: Snowflake,
        cOrM: string | MessageOptionsWithContent,
        msg?: MessageOptions
    ): Promise<Message> {
        let r: APIMessage;
        if (typeof cOrM === 'string') {
            if (msg) {
                msg['content'] = cOrM;
                r = await this.requestHandler.request('POST', MESSAGES(channelId), msg);
            } else {
                r = await this.requestHandler.request('POST', MESSAGES(channelId), {
                    content: cOrM
                });
            }
        } else {
            r = await this.requestHandler.request('POST', MESSAGES(channelId), cOrM);
        }
        if (r.guild_id && this.guilds.has(r.guild_id))
            await this.fetchGuild(r.guild_id);
        //TODO channel, user and members
        return new Message(this, r);
    }

    public async fetchApplicationCommands(): Promise<ApplicationCommand[] | undefined> {
        if (!this.user) return undefined;
        const cmds = await this.requestHandler.request(
            'GET',
            APPLICATION_GLOBAL_COMMANDS(this.user.id)
        );
        const commands: ApplicationCommand[] = [];
        for (const cmd of cmds) {
            commands.push(new ApplicationCommand(this, cmd));
        }
        return commands;
    }
}

// events declaration for docs
/**
 * when bot are online
 * @asMemberOf Client
 * @event ready
 */
export declare function ready(): void;

/**
 * when a gateway event are received
 * @param packet a object of ws packets
 * @asMemberOf Client
 * @event rawWS
 */
export declare function rawWS(packet: rawWSEvent): void;

/**
 * when bot are connected to websocket
 * @asMemberOf Client
 * @event connected
 */
export declare function connected(): void;

/**
 * when the websocket connection have a error
 * @param error the error
 * @asMemberOf Client
 * @event error
 */
export declare function error(error: Error): void;

export declare function warn(error: Error): void;
