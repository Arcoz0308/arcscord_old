import { ChannelTypes } from './Channel.ts';
import { GuildChannel } from './GuildChannel.ts';


export class CategoryChannel extends GuildChannel {
    public readonly type = ChannelTypes.CATEGORY_CHANNEL;
}
