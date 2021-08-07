import { ChannelTypes } from './Channel.ts';
import { GuildChannel } from './GuildChannel.ts';


export class StoreChannel extends GuildChannel {
    public readonly type = ChannelTypes.STORE_CHANNEL;
}
