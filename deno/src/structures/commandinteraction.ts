import { APIInteraction, Utils } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../client.ts';
import { Snowflake } from '../utils/snowflake.ts';
import { Base } from './base.ts';
import { Channel } from './channels/channel.ts';
import { Guild } from './guild.ts';
import { Member } from './member.ts';
import { User } from './user.ts';


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
        if (Utils.isGuildInteraction(data)) {
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
