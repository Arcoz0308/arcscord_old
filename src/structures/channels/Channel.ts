import {Base} from "../Base";
import {APIChannel, ChannelType, Snowflake} from "discord-api-types";
import {Client} from "../../Client";
import {TextChannel} from "./TextChannel";
import {PrivateChannel} from "./PrivateChannel";
import {VoiceChannel} from "./VoiceChannel";
import {GroupChannel} from "./GroupChannel";
import {NewsChannel} from "./NewsChannel";
import {StoreChannel} from "./StoreChannel";
import {StageChannel} from "./StageChannel";
import {GuildChannel} from "./GuildChannel";

export class Channel extends Base {
    public id: Snowflake;
    public readonly type: ChannelTypes
    constructor(client: Client, data: APIChannel) {
        super(client);
        this.id = data.id;
        this.type = data.type as unknown as ChannelTypes;
    }
    get mention(): string {
        return `<#${this.id}>`;
    }
    public static from(client: Client, data: APIChannel): Channel {
        switch (data.type) {
            case ChannelType.GUILD_TEXT:
                return new TextChannel(client, data);
            case ChannelType.DM:
                return new PrivateChannel(client, data);
            case ChannelType.GUILD_VOICE:
                return new VoiceChannel(client, data);
            case ChannelType.GROUP_DM:
                return new GroupChannel(client, data);
            case ChannelType.GUILD_CATEGORY:
                return new GroupChannel(client, data);
            case ChannelType.GUILD_NEWS:
                return new NewsChannel(client, data);
            case ChannelType.GUILD_STORE:
                return new StoreChannel(client, data);
            case ChannelType.GUILD_STAGE_VOICE:
                return new StageChannel(client, data);
            default:
                if (data.guild_id) {
                    if (data.last_message_id) {
                        client.emit('warn', new Error(`unknown textChannel type : ${data.type} id : ${data.id}, guild id : ${data.guild_id}`));
                        return new TextChannel(client, data)
                    }
                    client.emit('warn', new Error(`unknown GuildChannel type : ${data.type} id : ${data.id}, guild id : ${data.guild_id}`));
                    return new GuildChannel(client, data);
                }
                client.emit('warn', new Error('unknown channel type : ' + data.id));
                return new Channel(client, data);
        }
    }
}
export enum ChannelTypes {
    TEXT_CHANNEL,
    DM_CHANNEL,
    VOICE_CHANNEL,
    GROUP_CHANNEL,
    CATEGORY_CHANNEL,
    NEWS_CHANNEL,
    STORE_CHANNEL,
    UNKNOWN,
    STAGE_CHANNEL= 13
}