import { APIInteraction, Utils } from 'discord-api-types/v10';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';
import { Channel } from './channels/Channel';
import { Guild } from './Guild';
import { Member } from './Member';
import { User } from './User';


/**
 * @category Structures
 */
export class CommandInteraction extends Base {
    public id!: Snowflake;
    public channel!: Channel | null;
    public guild!: Guild | null;
    public user!: User | null;
    public member!: Member | null;
    public token!: string;
    public data!: APIInteraction;
    
    constructor(client: Client, data: APIInteraction) {
        super(client);
        this._patchData(data);
    }
    
    _patchData(data: APIInteraction) {
        this.data = data;
        this.id = data.id as Snowflake;
        this.channel = this.client.channels.get(data.channel_id as Snowflake) || null;
        this.token = data.token;
        if (Utils.isGuildInteraction(data)) {
            this.guild = this.client.guilds.get(data.guild_id as Snowflake)!;
            this.member =
                this.guild.members.get(data.member.user.id as Snowflake) ||
                new Member(this.client, this.guild, data.member);
            this.user = this.member.user;
        } else {
            this.guild = null;
            this.member = null;
            this.user = data.user ? this.client.users.get(data.user.id as Snowflake) || new User(this.client, data.user) : null;
        }
    }
}

/*
TODO finish this
export async function resolveInteractionCmdUserOption(option: ApplicationCommandOption): User|null {
    if (option.type !== 'user') return null;
    
    
}

 */
