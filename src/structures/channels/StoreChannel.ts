import {GuildChannel} from "./GuildChannel";
import {ChannelTypes} from "./Channel";

export class StoreChannel extends GuildChannel {
    public readonly type = ChannelTypes.STORE_CHANNEL;
}