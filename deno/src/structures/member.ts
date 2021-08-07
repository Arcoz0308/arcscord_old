import { APIGuildMember } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../client.ts';
import { Snowflake } from '../utils/snowflake.ts';
import { Base } from './base.ts';
import { Guild } from './guild.ts';
import { User } from './user.ts';


/**
 * @category Structures
 */
export class Member extends Base {
    public user: User;
    public nick: string | null;
    public roles: Snowflake[];
    public joinedAt: string;
    public premiumSince: string | null;
    public deaf: boolean;
    public mute: boolean;
    public guild: Guild;
    
    constructor(client: Client, guild: Guild, data: APIGuildMember) {
        super(client);
        
        this.user =
            this.client.users.get(data.user?.id as Snowflake) ||
            new User(client, data.user!);
        this.nick = typeof data.nick !== 'undefined' ? data.nick : null;
        this.roles = data.roles;
        this.joinedAt = data.joined_at;
        this.premiumSince =
            typeof data.premium_since !== 'undefined' ? data.premium_since : null;
        this.deaf = data.deaf;
        this.mute = data.mute;
        this.guild = guild;
    }
    
    toString(): string {
        return `<@${this.nick ? '!' : ''}${this.user?.id}>`;
    }
}
