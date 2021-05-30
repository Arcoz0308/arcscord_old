import {Action} from "./Action";
import {GatewayReadyDispatchData} from "discord-api-types";
import {ClientUser} from "../../structures/ClientUser";

export class READY extends Action {
    async handle(d: GatewayReadyDispatchData) {
        this.client.user = new ClientUser(this.client, d.user);
        this.client.users.set(d.user.id, this.client.user);
        for (const guild of d.guilds) {
            await this.client.gateway.createGuild(guild);
        }
        if (this.client.fetchAllMembers) {
             for (const [id] of this.client.guilds) {
                await this.client.fetchMembers(id, 1000);
             }
        }
        this.client.emit('ready');
    }
}