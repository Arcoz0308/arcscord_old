import { APIVoiceChannelBase } from 'discord-api-types/v10';
import { Client } from '../../Client';
import { ChannelTypes } from './Channel';
import { GuildChannel } from './GuildChannel';


export class VoiceChannel extends GuildChannel {
    public readonly type:
        | ChannelTypes.VOICE_CHANNEL
        | ChannelTypes.STAGE_CHANNEL
        | ChannelTypes.UNKNOWN;
    
    constructor(client: Client, data: APIVoiceChannelBase<any>) {
        super(client, data);
        this.type =
            (data.type as unknown as ChannelTypes) === ChannelTypes.VOICE_CHANNEL
                ? ChannelTypes.VOICE_CHANNEL
                : ChannelTypes.UNKNOWN;
    }
}
