import { ChannelTypes } from './channel.ts';
import { GuildChannel } from './guildchannel.ts';


export class StoreChannel extends GuildChannel {
    public readonly type = ChannelTypes.STORE_CHANNEL;
}
