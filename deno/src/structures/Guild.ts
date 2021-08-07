import { APIGuild } from 'discord-api-types/v9.ts';
import { Client } from '../Client.ts';
import { Collection } from '../utils/Collection.ts';
import { Snowflake } from '../utils/Snowflake.ts';
import { ApplicationCommand } from './ApplicationCommand.ts';
import { Base } from './Base.ts';
import { Channel, ChannelTypes } from './channels/Channel.ts';
import { VoiceChannel } from './channels/VoiceChannel.ts';
import { Member } from './Member.ts';
import { User } from './User.ts';


/**
 * @category Structures
 */
export class Guild extends Base {
    public readonly id: Snowflake;
    public name: string;
    public icon: string | null;
    public slash: string | null;
    public discoverySlash: string | null;
    public ownerId: Snowflake;
    public owner: User;
    public afkChannelId: Snowflake | null;
    public channels = new Collection<Snowflake, Channel>();
    public members = new Collection<Snowflake, Member>();
    public slashCommands = new Collection<Snowflake, ApplicationCommand>();
    
    public data: APIGuild;
    
    constructor(client: Client, data: APIGuild) {
        super(client);
        this.id = data.id as Snowflake;
        this.name = data.name;
        this.icon = data.icon;
        this.slash = data.splash;
        this.discoverySlash = data.discovery_splash;
        this.ownerId = data.owner_id as Snowflake;
        this.owner = client.users.get(data.owner_id as Snowflake)!;
        this.afkChannelId = data.afk_channel_id as Snowflake;
        
        this.data = data;
    }
    
    get afkChannel(): VoiceChannel | null {
        return this.afkChannelId && this.channels.has(this.afkChannelId) ?
            this.channels.get(this.afkChannelId)!.type === ChannelTypes.VOICE_CHANNEL ? this.channels.get(this.afkChannelId) as VoiceChannel : null
            : null;
    }
    
    /**
     * get all applications commands of this guild
     * @param [cache=true] set the commands to cache
     * @return a array of commands object
     */
    public fetchApplicationCommands(cache = true): Promise<ApplicationCommand[]> {
        return this.client.fetchGuildApplicationCommands(this.id, cache);
    }
}

