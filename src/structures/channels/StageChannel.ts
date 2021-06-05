import { ChannelTypes } from './Channel';
import { VoiceChannel } from './VoiceChannel';


export class StageChannel extends VoiceChannel {
    public readonly type = ChannelTypes.STAGE_CHANNEL;
}
