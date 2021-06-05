import { ChannelTypes } from './Channel';
import { GuildChannel } from './GuildChannel';


export class CategoryChannel extends GuildChannel {
    public readonly type = ChannelTypes.CATEGORY_CHANNEL;
}
