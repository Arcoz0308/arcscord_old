import { ChannelTypes } from './channel.ts';
import { GuildChannel } from './guildchannel.ts';


export class CategoryChannel extends GuildChannel {
    public readonly type = ChannelTypes.CATEGORY_CHANNEL;
}
