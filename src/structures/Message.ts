import {Base} from "./Base";
import {Snowflake} from "../utils/Utils";
import {Client} from "../Client";
import {APIMessage} from "discord-api-types";

/**
 * @category Structures
 */
export class Message extends Base {
    public id: Snowflake;
    public channelId: Snowflake;

    constructor(client: Client, data: APIMessage) {
        super(client);
        this.id = data.id;
        this.channelId = data.channel_id;
    }

}
export interface MessageOptions {

}
export interface MessageOptionsWithContent extends MessageOptions {
    content?: string;
}