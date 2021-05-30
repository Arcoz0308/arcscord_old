import {GuildChannel} from "./GuildChannel";
import {ChannelTypes} from "./Channel";
import {Client} from "../../Client";
import {APIChannel} from "discord-api-types";

export class VoiceChannel extends GuildChannel {
    public readonly type: ChannelTypes.VOICE_CHANNEL|ChannelTypes.STAGE_CHANNEL|ChannelTypes.UNKNOWN;

    constructor(client: Client, data: APIChannel) {
        super(client, data);
        if (!this['type']) this.type = data.type as unknown as ChannelTypes === ChannelTypes.VOICE_CHANNEL ? ChannelTypes.VOICE_CHANNEL : ChannelTypes.UNKNOWN;
    }
}