import { APIChannel } from 'discord-api-types';
import { Client } from '../../Client';
import { Channel, ChannelTypes } from './Channel';


export class GroupChannel extends Channel {
    public readonly type = ChannelTypes.GROUP_CHANNEL;
    
    constructor(client: Client, data: APIChannel) {
        super(client, data);
    }
}
