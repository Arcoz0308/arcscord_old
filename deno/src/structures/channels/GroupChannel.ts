import { APIChannel } from 'https://raw.githubusercontent.com/Arcoz0308/discord-api-types/main/deno/v9.ts';
import { Client } from '../../client.ts';
import { Channel, ChannelTypes } from './channel.ts';


export class GroupChannel extends Channel {
    public readonly type = ChannelTypes.GROUP_CHANNEL;
    
    constructor(client: Client, data: APIChannel) {
        super(client, data);
    }
}
