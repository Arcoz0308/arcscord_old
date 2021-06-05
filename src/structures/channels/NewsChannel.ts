import { ChannelTypes } from './Channel';
import { TextChannel } from './TextChannel';


export class NewsChannel extends TextChannel {
    public readonly type = ChannelTypes.NEWS_CHANNEL;
    public rateLimitPerUser = null; // news channel don't have message rate limit
}
