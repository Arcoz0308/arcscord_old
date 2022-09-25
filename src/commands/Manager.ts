import { Client } from '../Client';
import { Collection } from '../utils/Collection';
import EventEmitter from '../utils/EventEmitter';
import { Snowflake } from '../utils/Snowflake';
import { Command } from './Command';
import { NoNameError } from './errors';


export class CommandManager extends EventEmitter {
    public client: Client;
    public commands: Collection<Snowflake, Command> = new Collection<Snowflake, Command>();
    public guildCommands: Collection<Snowflake, Collection<Snowflake, Command>> = new Collection<Snowflake, Collection<Snowflake, Command>>();
    private commandsQueue: Command[] = [];
    private guildCommandsQueue: Collection<Snowflake, Command[]> = new Collection<Snowflake, Command[]>();
    
    constructor(client: Client) {
        super();
        this.client = client;
    }
    
    /**
     *
     * @param cmd
     * @return return an error if something wrong
     */
    newCommand(cmd: Command): Error | void {
        if (!cmd.name) return new NoNameError();
        this.commandsQueue.push(cmd);
        
    }
    
    newCommands(...cmds: Command[]): Error | void {
        cmds.forEach((cmd) => {
            let err: Error | void = undefined;
            err = this.newCommand(cmd);
            if (err) return err;
        });
    }
    
    newGuildCommand(cmd: Command, guildId: Snowflake): Error | void {
        if (!cmd.name) return new NoNameError();
        if (this.guildCommandsQueue.has(guildId)) {
            this.guildCommandsQueue.get(guildId)!.push(cmd);
        } else {
            this.guildCommandsQueue.set(guildId, [cmd]);
        }
    }
    
    /**
     * update to api all commands
     * @param global
     * @param guild
     */
    updateCommands(global: boolean = true, guild: boolean = true): Promise<void> {
        return new Promise(async (resolve, reject) => {
        
        });
    }
}