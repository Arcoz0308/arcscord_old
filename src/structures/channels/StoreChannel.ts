import { ChannelTypes } from './Channel';
import { GuildChannel } from './GuildChannel';


export class StoreChannel extends GuildChannel {
    public readonly type = ChannelTypes.STORE_CHANNEL;
}
