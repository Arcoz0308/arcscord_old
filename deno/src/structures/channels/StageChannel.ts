import { ChannelTypes } from './channel.ts';
import { VoiceChannel } from './voicechannel.ts';


export class StageChannel extends VoiceChannel {
    public readonly type = ChannelTypes.STAGE_CHANNEL;
}
