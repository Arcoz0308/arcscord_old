import {
    APIInteraction,
    InteractionType,
    LocaleString,
    Utils
} from 'discord-api-types/v10';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';
import { Channel } from './channels/Channel';
import { Guild } from './Guild';
import { Member } from './Member';
import { Message } from './Message';
import { User } from './User';


export interface CommandInteractionData {
    id: Snowflake;
    name: string;
    
}

export type InteractionData = CommandInteractionData;

/**
 * @category Structures
 */
export class Interaction extends Base {
    public id!: Snowflake;
    public channel!: Channel | null;
    public type!: number;
    public data!: InteractionData | null;
    public version!: number;
    public guild!: Guild | null;
    public user!: User | null;
    public member!: Member | null;
    public message!: Message | null;
    public token!: string;
    public rawData!: APIInteraction;
    public locale!: LocaleString | null;
    public guildLocale!: LocaleString | null;
    
    constructor(client: Client, data: APIInteraction) {
        super(client);
        this._patchData(data);
    }
    
    _patchData(data: APIInteraction) {
        this.rawData = data;
        this.id = data.id as Snowflake;
        this.type = data.type;
        this.version = data.version;
        this.channel = this.client.channels.get(data.channel_id as Snowflake) || null;
        this.message = data.message ? new Message(this.client, data.message) : null;
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
        this.locale = data.type === InteractionType.Ping ? null : data.locale || null;
        this.guildLocale = data.guild_locale || null;
    }
}

