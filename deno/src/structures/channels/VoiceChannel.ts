import { APIChannel } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../../Client.ts';
import { ChannelTypes } from './Channel.ts';
import { GuildChannel } from './GuildChannel.ts';


export class VoiceChannel extends GuildChannel {
    public readonly type:
        | ChannelTypes.VOICE_CHANNEL
        | ChannelTypes.STAGE_CHANNEL
        | ChannelTypes.UNKNOWN;
    
    constructor(client: Client, data: APIChannel) {
        super(client, data);
        this.type =
            (data.type as unknown as ChannelTypes) === ChannelTypes.VOICE_CHANNEL
                ? ChannelTypes.VOICE_CHANNEL
                : ChannelTypes.UNKNOWN;
    }
}
