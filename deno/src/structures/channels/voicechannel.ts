import { APIChannel } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../../client.ts';
import { ChannelTypes } from './channel.ts';
import { GuildChannel } from './guildchannel.ts';


export class VoiceChannel extends GuildChannel {
    public readonly type:
        | ChannelTypes.VOICE_CHANNEL
        | ChannelTypes.STAGE_CHANNEL
        | ChannelTypes.UNKNOWN;
    
    constructor(client: Client, data: APIChannel) {
        super(client, data);
        if (!this['type'])
            this.type =
                (data.type as unknown as ChannelTypes) === ChannelTypes.VOICE_CHANNEL
                    ? ChannelTypes.VOICE_CHANNEL
                    : ChannelTypes.UNKNOWN;
    }
}
