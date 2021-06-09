import { Channel } from './Channel';
import { Message, MessageOptions, MessageOptionsWithContent } from "../Message";


export class PrivateChannel extends Channel {

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
