import { APIApplicationCommand } from 'discord-api-types';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';
import { Guild } from './Guild';

export interface ApplicationCommandBase {
    /**
     * the name of the command
     */
    name: string;
    /**
     * the description of the command
     */
    description: string;
    /**
     * the options of the command
     */
    options: Array<ApplicationCommandOption|ApplicationCommandOptionWithSubCommand>;
    /**
     * if the command are enable when the app is add to a guild
     */
    defaultPermissions: boolean;
}
export interface EditApplicationCommandOptions {
    /**
     * the name of the command
     */
    name?: string;
    /**
     * the description of the command
     */
    description?: string;
    /**
     * the options of the command
     */
    options?: Array<ApplicationCommandOption|ApplicationCommandOptionWithSubCommand>;
    /**
     * if the command are enable when the app is add to a guild
     */
    defaultPermissions?: boolean;
}
export interface ApplicationCommandOption {
    /**
     * the type of the command option
     */
    type: ApplicationCommandOptionsType;
    /**
     * name of the command option (1 to 32 characters that match `^[\w-]{1,32}$`)
     */
    name: string;
    /**
     * description of the command option (1 to 100 characters)
     */
    description: string;
    /**
     * if the option is required
     * @default false
     */
    required: boolean;
    
    /**
     * choices of the command option,You can specify a maximum of 25 choices per option
     */
    choices?: ApplicationCommandOptionChoice[];
}
export interface ApplicationCommandOptionWithSubCommand extends ApplicationCommandOption{
    /**
     * options of command subCommand/subCommandGroup
     */
    options?: ApplicationCommandOption;
}
export enum ApplicationCommandOptionsTypes {
    subCommand = 1,
    subCommandGroup,
    string,
    integer,
    boolean,
    user,
    channel,
    role,
    mentionable
}
export interface ApplicationCommandOptionChoice {
    /**
     * the name of the choice
     */
    name: string;
    /**
     * the value of the choice
     */
    value: string|number;
}
export type ApplicationCommandOptionsType = keyof typeof ApplicationCommandOptionsTypes;
export class ApplicationCommand extends Base {
    /**
     * the id of the command
     */
    public id: Snowflake;
    
    /**
     * the guild of the command (is null for global commands)
     */
    public guild: Guild|null;
    
    /**
     * the name of the command
     */
    public name: string;
    
    /**
     * the description of the command
     */
    public description: string;
    
    /**
     * the options of the command
     */
    public options: ApplicationCommandOption[]|null;
    
    /**
     * if the command is enable by default on add guild
     */
    public defaultOptions: boolean;
    /**
     * @internal
     */
    public data: APIApplicationCommand;

    constructor(client: Client, data: APIApplicationCommand) {
        super(client);
        this.id = data.id;
        this.guild = data['guild_id'] ? client.guilds.get(data['guild_id']) || null : null;
        this.name = data.name;
        this.description = data.description;
        this.options = data.options ? data.options as unknown as ApplicationCommandOption[] : null;
        this.defaultOptions = typeof data.default_permission !== 'undefined' ? data.default_permission : true;
        this.data = data;
    }
    public toString(): string {
        return `${this.name} : ${this.description}`;
    }
}

