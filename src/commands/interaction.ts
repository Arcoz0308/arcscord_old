import { Member, User } from '../structures';
import { Permission } from '../utils/Permissions';
import { Snowflake } from '../utils/Snowflake';


export interface CommandInteractionContext {
    /**
     * Member object of the interaction author
     */
    member?: Member;
    
    /**
     * Author of the interaction
     */
    author: User;
    
    /**
     * The locale language of the interaction author
     */
    locale: string;
    
    /**
     * The locale language of the guild where the interaction was created, only available in guild
     */
    guildLocale?: string;
    
    /**
     * the id of the channel where interaction was created, dm or guild channel
     */
    channelId: Snowflake;
    
    /**
     * permissions bits that the bot have in the channel of the interaction
     */
    permissions?: bigint;
    data: object;
    guild: boolean;
    _id: Snowflake;
    _applicationId: Snowflake;
    _token: string;
    
    /**
     * alias for hasPermission(permissions: bigint, permission: Permission): boolean
     * @param permission
     */
    hasPermission(permission: Permission): boolean;
}
