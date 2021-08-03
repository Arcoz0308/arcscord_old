import { APIChannel } from 'https://deno.land/x/discord_api_types/v9.ts';
import { Client } from '../../Client.ts';
import { Snowflake } from '../../utils/Snowflake.ts';
import { Message, MessageOptions, MessageOptionsWithContent } from '../Message.ts';
import { ChannelTypes } from './Channel.ts';
import { GuildChannel } from './GuildChannel.ts';


export class TextChannel extends GuildChannel {
  public readonly type:
    | ChannelTypes.TEXT_CHANNEL
    | ChannelTypes.NEWS_CHANNEL
    | ChannelTypes.UNKNOWN = ChannelTypes.TEXT_CHANNEL;
  public topic: string | null;
  public rateLimitPerUser: number | null;
  public lastMessageId: Snowflake | null;

  constructor(client: Client, data: APIChannel) {
    super(client, data);
    this.topic = data.topic || null;
    this.rateLimitPerUser = data.rate_limit_per_user || null;
    this.lastMessageId = data.last_message_id || null;
  }

  update(data: APIChannel): GuildChannel {
    this.lastMessageId = data.last_message_id || null;
    this.topic = data.topic || null;
    this.rateLimitPerUser = data.rate_limit_per_user || null;
    return super.update(data);
  }

  public createMessage(content: string, msg?: MessageOptions): Promise<Message>;
  public createMessage(msg: MessageOptionsWithContent): Promise<Message>;
  public async createMessage(
    cOrM: string | MessageOptionsWithContent,
    msg?: MessageOptions
  ): Promise<Message> {
    if (typeof cOrM === "string")
      return this.client.createMessage(this.id, cOrM, msg);
    return this.client.createMessage(this.id, cOrM);
  }
}
