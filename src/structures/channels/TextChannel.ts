import { GuildChannel } from './GuildChannel';
import { ChannelTypes } from './Channel';

export class TextChannel extends GuildChannel {
    public readonly type: ChannelTypes.TEXT_CHANNEL | ChannelTypes.NEWS_CHANNEL =
        ChannelTypes.TEXT_CHANNEL;
}
