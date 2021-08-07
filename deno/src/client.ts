import {
    APIChannel,
    APIGuildMember,
    APIMessage,
    GatewayDispatchEvents
} from 'https://raw.githubusercontent.com/Arcoz0308/discord-api-types/main/deno/v9.ts';
import { Intents } from './constants.ts';
import { Gateway, rawWSEvent } from './gateway/gateway.ts';
import {
    APPLICATION_GLOBAL_COMMAND,
    APPLICATION_GLOBAL_COMMANDS,
    APPLICATION_GUILD_COMMAND,
    APPLICATION_GUILD_COMMANDS,
    DM_CHANNEL,
    GATEWAY_CONNECT,
    GUILD,
    GUILD_MEMBERS,
    MESSAGES
} from './rest/endpoints.ts';
import { RestManager } from './rest/restmanager.ts';
import {
    ApplicationCommand,
    ApplicationCommandBase,
    Channel,
    ClientUser,
    EditApplicationCommandOptions,
    Guild,
    Member,
    Message,
    MessageOptions,
    MessageOptionsWithContent,
    Presence,
    PrivateChannel,
    resolveApplicationCommandForApi,
    User
} from './structures/mod.ts';
import { Collection } from './utils/collection.ts';
import { RequestError } from './utils/errors.ts';
import { EventEmitter } from './utils/eventemitter.ts';
import { Snowflake } from './utils/snowflake.ts';


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

export class Client extends EventEmitter<{
    /**
     * when bot are online
     */
    ready: typeof ready;
    
    /**
     * when bot receive a Websocket event
     */
    rawWS: typeof rawWS;
    
    /**
     * when bot are connected to Websocket
     */
    connected: typeof connected;
    
    /**
     * when the websocket connection have a error
     */
    error: typeof error;
    
    [key: string]: (...param: any) => void;
}> {
    
    
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
    public requestHandler: RestManager;
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
    
    public ws = {
        ping: -1
    };
    public rest = {
        ping: -1
    };
    
    public users = new Collection<Snowflake, User>();
    public guilds = new Collection<Snowflake, Guild>();
    public channels = new Collection<Snowflake, Channel>();
    public slashCommands = new Collection<Snowflake, ApplicationCommand>();
    
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
        this.on('ready', () => {
        });
        this.token = token;
        this.slashCommand = typeof options.slashCommandByDefault === 'undefined' ? true : options.slashCommandByDefault;
        let intents = 32765;
        
        if (options.disableIntents)
            for (const intent of options.disableIntents) {
                intents -= Intents[intent];
            }
        this.intents = intents;
        
        this.disableEvents = options.disablesEvents;
        this.presence = options.presence ? options.presence : {};
        this.fetchAllMembers = !!options.fetchAllMembers;
        this.bot = typeof options.isABot === 'undefined' || options.isABot;
        
        this.gateway = new Gateway(this);
        this.requestHandler = new RestManager(this);
        
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
    
    public async fetchGuild(id: Snowflake, checkCache: boolean = true, setToCache: boolean = true): Promise<Guild> {
        
        if (checkCache && this.guilds.has(id))
            return this.guilds.get(id)!;
        
        const g = await this.requestHandler.request('GET', GUILD(id)).catch((e) => {
            return e;
        });
        const guild = new Guild(this, g);
        
        if (setToCache)
            this.guilds.set(id, guild);
        
        return guild;
        
    }
    
    public async fetchMembers(guildId: Snowflake, limit: number = 100, setToCache: boolean = true, after: number = 0): Promise<Member[]> {
        return new Promise<Member[]>(async (resolve, reject) => {
            if (!this.guilds.get(guildId))
                await this.fetchGuild(guildId);
            if (!this.guilds.get(guildId))
                return reject(new Error('UNKNOWN ERROR on fetching members from ' + guildId));
            
            const r = (await this.requestHandler.request('GET', GUILD_MEMBERS(guildId, limit, after)).catch((e) => {
                return reject(e);
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
            resolve(members);
        });
        
        
    }
    
    public createMessage(channelId: Snowflake, content: string, msg?: MessageOptions): Promise<Message>;
    public createMessage(channelId: Snowflake, msg: MessageOptionsWithContent): Promise<Message>;
    public async createMessage(channelId: Snowflake, cOrM: string | MessageOptionsWithContent, msg?: MessageOptions): Promise<Message> {
        
        let r: APIMessage;
        
        if (typeof cOrM === 'string') {
            if (msg) {
                msg['content'] = cOrM;
                r = await this.requestHandler.request('POST', MESSAGES(channelId), msg);
            } else
                r = await this.requestHandler.request('POST', MESSAGES(channelId), { content: cOrM });
        } else
            r = await this.requestHandler.request('POST', MESSAGES(channelId), cOrM);
        if (r.guild_id && !this.guilds.has(r.guild_id))
            await this.fetchGuild(r.guild_id);
        
        //TODO channel, user and members
        return new Message(this, r);
        
    }
    
    public async createDM(userId: Snowflake): Promise<PrivateChannel> {
        
        let r: APIChannel = await this.requestHandler.request('POST', DM_CHANNEL, { recipient_id: userId });
        const channel = new PrivateChannel(this, r);
        
        if (!this.channels.get(channel.id))
            this.channels.set(channel.id, channel);
        
        return new PrivateChannel(this, r);
        
    }
    
    /**
     * get all global bot applications commands
     * @param [cache=true] set the commands to cache
     * @return a array of commands object
     */
    public fetchApplicationCommands(cache = true): Promise<ApplicationCommand[]> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            
            const commands: ApplicationCommand[] = [];
            for (const cmd of await this.requestHandler.request('GET', APPLICATION_GLOBAL_COMMANDS(this.user.id))) {
                const command = new ApplicationCommand(this, cmd);
                commands.push(command);
                if (cache) this.slashCommands.set(command.id, command);
            }
            
            resolve(commands);
        });
    }
    
    /**
     * Create a new global command. New global commands will be available in all guilds after 1 hour <br>
     * ⚠ Creating a command with the same name as an existing command for your application will overwrite the old command. see [discord-api-docs](https://discord.com/developers/docs/interactions/slash-commands#create-global-application-command)
     * @param data a base object of the command
     * @param [cache=true] set the command to cache
     */
    public createApplicationCommand(data: ApplicationCommandBase, cache = true): Promise<ApplicationCommand> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            data = resolveApplicationCommandForApi(data) as ApplicationCommandBase;
            const command = new ApplicationCommand(this, await this.requestHandler.request('POST', APPLICATION_GLOBAL_COMMANDS(this.user.id), data));
            if (cache) this.slashCommands.set(command.id, command);
            resolve(command);
        });
    }
    
    /**
     * fetch a global application command with the command id
     * @param commandId the id of the command
     * @param [checkCache=true] check if the command are already in the cache
     * @param [cache=true] set the command to cache
     */
    public fetchApplicationCommand(commandId: Snowflake, checkCache = true, cache = true): Promise<ApplicationCommand> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            if (checkCache && this.slashCommands.has(commandId))
                return resolve(this.slashCommands.get(commandId)!);
            const command = new ApplicationCommand(this, await this.requestHandler.request('GET', APPLICATION_GLOBAL_COMMAND(this.user.id, commandId)));
            if (cache) this.slashCommands.set(command.id, command);
            resolve(command);
            
        });
    }
    
    /**
     * Edit a global command. Updates will be available in all guilds after 1 hour
     * @param commandId the id of the command
     * @param data options to edit
     * @param [cache=true] set/update the command to cache
     */
    public editApplicationCommand(commandId: Snowflake, data: EditApplicationCommandOptions, cache = true): Promise<ApplicationCommand> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            if (!(data.name && data.description && data.options && data.defaultPermissions))
                return reject(new Error('you need to change one options or more'));
            data = resolveApplicationCommandForApi(data) as EditApplicationCommandOptions;
            const cmd = await this.requestHandler.request('PATCH', APPLICATION_GLOBAL_COMMAND(this.user.id, commandId), data);
            const command = this.slashCommands.has(commandId) ?
                this.slashCommands.get(commandId)!.updateData(cmd) :
                new ApplicationCommand(this, cmd);
            if (cache) this.slashCommands.set(command.id, command);
            resolve(command);
        });
    }
    
    /**
     * delete a global application command
     * @param commandId the id of the command
     */
    public deleteApplicationCommand(commandId: Snowflake): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            await this.requestHandler.request('DELETE', APPLICATION_GLOBAL_COMMAND(this.user.id, commandId));
            this.slashCommands.delete(commandId);
            resolve();
        });
    }
    
    /**
     * Takes a list of application commands, overwriting existing commands that are registered globally for this application. Updates will be available in all guilds after 1 hour.
     * @param commands a list of command object
     * @param [cache=true] set commands to cache
     */
    public bulkOverwriteApplicationCommands(commands: ApplicationCommandBase[], cache = true): Promise<ApplicationCommand[]> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            commands = commands.map(cmd => resolveApplicationCommandForApi(cmd)) as ApplicationCommandBase[];
            const cmds = [];
            for (const cmd of await this.requestHandler.request('PUT', APPLICATION_GLOBAL_COMMANDS(this.user.id), commands)) {
                const command = new ApplicationCommand(this, cmd);
                cmds.push(command);
                if (cache) this.slashCommands.set(command.id, command);
            }
            resolve(cmds);
        });
    }
    
    /**
     * get all applications commands of a guild
     * @param guildID the id of the guild
     * @param [cache=true] set the commands to cache
     * @return a array of commands object
     */
    public fetchGuildApplicationCommands(guildID: Snowflake, cache = true): Promise<ApplicationCommand[]> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            
            const commands: ApplicationCommand[] = [];
            for (const cmd of await this.requestHandler.request('GET', APPLICATION_GUILD_COMMANDS(this.user.id, guildID))) {
                if (!this.guilds.has(cmd.guild_id)) await this.fetchGuild(cmd.guild_id);
                const command = new ApplicationCommand(this, cmd);
                commands.push(command);
                if (cache) this.guilds.get(cmd.guild_id)!.slashCommands.set(command.id, command);
            }
            
            resolve(commands);
        });
    }
    
    /**
     * Create a new guild command. <br>
     * ⚠ Creating a command with the same name as an existing command for your application will overwrite the old command. see [discord-api-docs](https://discord.com/developers/docs/interactions/slash-commands#create-guild-application-command)
     * @param guildId the id of the guild
     * @param data a base object of the command
     * @param [cache=true] set the command to cache
     */
    public createGuildApplicationCommand(guildId: Snowflake, data: ApplicationCommandBase, cache = true): Promise<ApplicationCommand> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            data = resolveApplicationCommandForApi(data) as ApplicationCommandBase;
            if (!this.guilds.has(guildId)) await this.fetchGuild(guildId);
            const command = new ApplicationCommand(this, await this.requestHandler.request('POST', APPLICATION_GUILD_COMMANDS(this.user.id, guildId), data));
            if (cache) this.guilds.get(guildId)!.slashCommands.set(command.id, command);
            resolve(command);
        });
    }
    
    /**
     * fetch a guild command with id
     * @param guildId the id of the guild
     * @param commandId the id of the command
     * @param [checkCache=true] check if  command are already in cache
     * @param [cache=true] set the command to cache
     */
    public fetchGuildApplicationCommand(guildId: Snowflake, commandId: Snowflake, checkCache = true, cache = true): Promise<ApplicationCommand> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            if (!this.guilds.has(guildId)) await this.fetchGuild(guildId);
            if (checkCache && this.guilds.get(guildId)!.slashCommands.has(commandId))
                return resolve(this.guilds.get(guildId)!.slashCommands.get(commandId)!);
            const cmd = await this.requestHandler.request('GET', APPLICATION_GUILD_COMMAND(this.user.id, guildId, commandId));
            const command = new ApplicationCommand(this, cmd);
            if (cache) this.guilds.get(guildId)!.slashCommands.set(command.id, command);
            resolve(command);
        });
    }
    
    /**
     * Edit a guild command.
     * @param guildId the id of the guild
     * @param commandId the id of the command
     * @param data options to edit
     * @param [cache=true] set/update the command to cache
     */
    public editGuildApplicationCommand(guildId: Snowflake, commandId: Snowflake, data: EditApplicationCommandOptions, cache = true): Promise<ApplicationCommand> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            if (!(data.name && data.description && data.options && data.defaultPermissions))
                return reject(new Error('you need to change one options or more'));
            data = resolveApplicationCommandForApi(data) as EditApplicationCommandOptions;
            const cmd = await this.requestHandler.request('PATCH', APPLICATION_GUILD_COMMAND(this.user.id, guildId, commandId), data);
            if (!this.guilds.has(guildId)) await this.fetchGuild(guildId);
            const command = this.guilds.get(guildId)!.slashCommands.has(commandId) ?
                this.guilds.get(guildId)!.slashCommands.get(commandId)!.updateData(cmd) :
                new ApplicationCommand(this, cmd);
            if (cache) this.guilds.get(guildId)!.slashCommands.set(command.id, command);
            resolve(command);
        });
    }
    
    /**
     * delete a guild command
     * @param guildId the id of the guild
     * @param commandId the id of the command
     */
    public deleteGuildApplicationCommand(guildId: Snowflake, commandId: Snowflake): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            await this.requestHandler.request('DELETE', APPLICATION_GUILD_COMMAND(this.user.id, guildId, commandId));
            if (this.guilds.has(guildId)) this.guilds.get(guildId)!.slashCommands.delete(commandId);
            resolve();
        });
    }
    
    /**
     * Takes a list of application commands, overwriting existing commands for the guild.
     * @param guildId the id of the guild
     * @param commands a list of command object
     * @param [cache=true] set commands to cache
     */
    public bulkOverwriteGuildApplicationCommands(guildId: Snowflake, commands: ApplicationCommandBase[], cache = true): Promise<ApplicationCommand[]> {
        return new Promise(async (resolve, reject) => {
            if (!this.user)
                return reject(new Error('client isn\'t connected'));
            commands = commands.map(cmd => resolveApplicationCommandForApi(cmd)) as ApplicationCommandBase[];
            const cmds = [];
            if (!this.guilds.has(guildId)) await this.fetchGuild(guildId);
            for (const cmd of await this.requestHandler.request('PUT', APPLICATION_GUILD_COMMANDS(this.user.id, guildId), commands)) {
                const command = new ApplicationCommand(this, cmd);
                cmds.push(command);
                if (cache) this.slashCommands.set(command.id, command);
            }
            resolve(cmds);
        });
    }
    
    public toJSON(space = 1): string {
        return JSON.stringify({
            user: this.user ? this.user.toJSON(space) : null,
            application_global_commands: this.slashCommands.toJSON(space)
        }, null, space);
    }
}

// events declaration for docs
/**
 * when bot are online
 * @asMemberOf Client
 * @event Client#ready
 */
export declare function ready(): void;

/**
 * when bot receive a Websocket event
 * @param packet a object of ws packets
 * @asMemberOf Client
 * @event Client#rawWS
 */
export declare function rawWS(packet: rawWSEvent): void;

/**
 * when bot are connected to websocket
 * @asMemberOf Client
 * @event Client#connected
 */
export declare function connected(): void;

/**
 * when the websocket connection have a error
 * @param error the error
 * @asMemberOf Client
 * @event Client#error
 */
export declare function error(error: Error): void;

export declare function warn(error: Error): void;
