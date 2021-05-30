import {VoiceChannel} from "./VoiceChannel";
import {ChannelTypes} from "./Channel";

export class StageChannel extends VoiceChannel {
    public readonly type = ChannelTypes.STAGE_CHANNEL;
}