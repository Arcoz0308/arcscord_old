import { APIGuildMember } from 'https://deno.land/x/discord_api_types/v9.ts';
import { Client } from '../Client.ts';
import { Snowflake } from '../utils/Snowflake.ts';
import { Base } from './Base.ts';
import { Guild } from './Guild.ts';
import { User } from './User.ts';


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
