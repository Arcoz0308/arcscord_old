import { GatewayReadyDispatchData } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { ClientUser } from '../../structures/mod.ts';
import { Snowflake } from '../../utils/Snowflake.ts';
import { Action } from './Action.ts';


export class READY extends Action {
    async handle(d: GatewayReadyDispatchData) {
        this.client.user = new ClientUser(this.client, d.user);
        this.client.users.set(d.user.id as Snowflake, this.client.user);
        for (const guild of d.guilds) {
            await this.client.gateway.createGuild(guild);
        }
        if (this.client.fetchAllMembers) {
            for (const [id] of this.client.guilds) {
                await this.client.fetchMembers(id, 1000);
            }
        }
        if (this.client.slashCommand) {
            const commands = await this.client.fetchApplicationCommands();
            if (commands) {
                for (const command of commands) {
                    this.client.slashCommands.set(command.id, command);
                }
            }
        }
        this.client.emit('ready');
    }
}
