import {GuildChannel} from "./GuildChannel";
import {ChannelTypes} from "./Channel";

export class CategoryChannel extends GuildChannel {
    public readonly type = ChannelTypes.CATEGORY_CHANNEL;
}