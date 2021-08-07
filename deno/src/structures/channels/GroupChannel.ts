import { APIChannel } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../../Client.ts';
import { Channel, ChannelTypes } from './Channel.ts';


export class GroupChannel extends Channel {
    public readonly type = ChannelTypes.GROUP_CHANNEL;
    
    constructor(client: Client, data: APIChannel) {
        super(client, data);
    }
}
