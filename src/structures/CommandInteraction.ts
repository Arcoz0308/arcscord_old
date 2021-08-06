import { APIInteraction } from 'discord-api-types';
import { isGuildInteraction } from 'discord-api-types/utils';
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
    public id: Snowflake;
    public channel: Channel | null;
    public guild: Guild | null;
    public user: User;
    public member: Member | null;
    public token: string;
    public data: APIInteraction;
    
    constructor(client: Client, data: APIInteraction) {
        super(client);
        this.data = data;
        this.id = data.id;
        this.channel = client.channels.get(data.channel_id) || null;
        this.token = data.token;
        if (isGuildInteraction(data)) {
            this.guild = client.guilds.get(data.guild_id)!;
            this.member =
                this.guild.members.get(data.member.user.id) ||
                new Member(client, this.guild, data.member);
            this.user = this.member.user;
        } else {
            this.guild = null;
            this.member = null;
            this.user = client.users.get(data.user.id) || new User(client, data.user);
        }
    }
}

/*
TODO finish this
export async function resolveInteractionCmdUserOption(option: ApplicationCommandOption): User|null {
    if (option.type !== 'user') return null;
    
    
}

 */
