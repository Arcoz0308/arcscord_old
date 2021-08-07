import { APIInteraction, Utils } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../Client.ts';
import { Snowflake } from '../utils/Snowflake.ts';
import { Base } from './Base.ts';
import { Channel } from './channels/Channel.ts';
import { Guild } from './Guild.ts';
import { Member } from './Member.ts';
import { User } from './User.ts';


/**
 * @category Structures
 */
export class CommandInteraction extends Base {
    public id: Snowflake;
    public channel: Channel | null;
    public guild: Guild | null;
    public user?: User;
    public member: Member | null;
    public token: string;
    public data: APIInteraction;
    
    constructor(client: Client, data: APIInteraction) {
        super(client);
        this.data = data;
        this.id = data.id as Snowflake;
        this.channel = client.channels.get(data.channel_id as Snowflake) || null;
        this.token = data.token;
        if (Utils.isGuildInteraction(data)) {
            this.guild = client.guilds.get(data.guild_id as Snowflake)!;
            this.member =
                this.guild.members.get(data.member.user.id as Snowflake) ||
                new Member(client, this.guild, data.member);
            this.user = this.member.user;
        } else {
            this.guild = null;
            this.member = null;
            this.user = data.user ? client.users.get(data.user.id as Snowflake) || new User(client, data.user) : undefined;
        }
    }
}

/*
TODO finish this
export async function resolveInteractionCmdUserOption(option: ApplicationCommandOption): User|null {
    if (option.type !== 'user') return null;
    
    
}

 */
