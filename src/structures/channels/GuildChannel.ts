import {Channel} from "./Channel";
import {Client} from "../../Client";
import {APIChannel} from "discord-api-types";
import {Guild} from "../Guild";

export class GuildChannel extends Channel{
    public name: string;
    public guild: Guild;
    constructor(client: Client, data: APIChannel) {
        super(client, data);
        this.guild = client.guilds.get(data.guild_id!)!;
        this.name = data.name!;
    }
    update(data: APIChannel) {
        if (data.name !== this.name) this.name = data.name!;
    }
}