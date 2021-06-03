import { Channel, ChannelTypes } from './Channel';

export class GroupChannel extends Channel {
    public readonly type = ChannelTypes.GROUP_CHANNEL;
}
