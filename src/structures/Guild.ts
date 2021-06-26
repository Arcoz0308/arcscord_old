import { APIGuild } from 'discord-api-types';
import { Client } from '../Client';
import { Collection } from '../utils/Collection';
import { Snowflake } from '../utils/Snowflake';
import { ApplicationCommand } from './ApplicationCommand';
import { Base } from './Base';
import { Channel, ChannelTypes } from './channels/Channel';
import { VoiceChannel } from './channels/VoiceChannel';
import { Member } from './Member';
import { User } from './User';


/**
 * @category Structures
 */
export class Guild extends Base {
    public readonly id: Snowflake;
    public name: string;
    public icon: string|null;
    public slash: string|null;
    public discoverySlash: string|null;
    public ownerId: Snowflake;
    public owner: User;
    public afkChannelId: Snowflake|null;
    public channels = new Collection<Snowflake, Channel>();
    public members = new Collection<Snowflake, Member>();
    
    public data: APIGuild;

    constructor(client: Client, data: APIGuild) {
        super(client);
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.slash = data.splash;
        this.discoverySlash = data.discovery_splash;
        this.ownerId = data.owner_id;
        this.owner = client.users.get(data.owner_id)!;
        this.afkChannelId = data.afk_channel_id;
        
        this.data = data;
    }
    get afkChannel(): VoiceChannel|null {
        return this.afkChannelId && this.channels.has(this.afkChannelId) ?
                this.channels.get(this.afkChannelId)!.type === ChannelTypes.VOICE_CHANNEL ? this.channels.get(this.afkChannelId) as VoiceChannel : null
            : null
    }
    /**
     * get all applications commands of this guild
     * @param [cache=true] set the commands to cache
     * @return a array of commands object
     */
    public fetchApplicationCommands(cache = true): Promise<ApplicationCommand[]> {
        return this.client.fetchApplicationGuildCommands(this.id, cache);
    }
}

