import { ChannelTypes } from './channel.ts';
import { TextChannel } from './textchannel.ts';


export class NewsChannel extends TextChannel {
    public rateLimitPerUser = null; // news channel don't have message rate limit
    public readonly type = ChannelTypes.NEWS_CHANNEL;
}
