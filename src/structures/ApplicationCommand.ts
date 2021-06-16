import { APIApplicationCommand } from 'discord-api-types';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';

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
    name: string;
    value: string|number;
}
export type ApplicationCommandOptionsType = keyof typeof ApplicationCommandOptionsTypes;
export class ApplicationCommand extends Base {
    public id: Snowflake;
    public data: APIApplicationCommand;

    constructor(client: Client, data: APIApplicationCommand) {
        super(client);
        this.data = data;
        this.id = data.id;
    }
}
