import { ChannelTypes } from './Channel.ts';
import { VoiceChannel } from './VoiceChannel.ts';


export class StageChannel extends VoiceChannel {
    public readonly type = ChannelTypes.STAGE_CHANNEL;
}
