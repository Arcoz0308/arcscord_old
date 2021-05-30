import {TextChannel} from "./TextChannel";
import {ChannelTypes} from "./Channel";

export class NewsChannel extends TextChannel {
    public readonly type = ChannelTypes.NEWS_CHANNEL;
}