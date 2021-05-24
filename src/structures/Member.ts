import {Base} from "./Base";
import {User} from "./User";
import {Snowflake} from "../utils/Utils";
import {Client} from "../Client";
import {APIGuildMember} from "discord-api-types";

/**
 * @category Structures
 */
class Member extends Base {
    public user?: User;
    public nick: string | null;
    public roles: Snowflake[];
    public joinedAt: string;
    public premiumSince: string | null;
    public deaf: boolean;
    public mute: boolean;

    constructor(client: Client, data: APIGuildMember) {
        super(client);

        this.user = this.client.users.get(data.user?.id as Snowflake) || (data.user ? new User(client, data.user) : undefined);
        this.nick = typeof data.nick !== 'undefined' ? data.nick : null;
        this.roles = data.roles;
        this.joinedAt = data.joined_at;
        this.premiumSince = typeof data.premium_since !== 'undefined' ? data.premium_since : null;
        this.deaf = data.deaf;
        this.mute = data.mute;
    }

    toString(): string {
        return `<@${this.nick ? '!' : ''}${this.user?.id}>`;
    }
}