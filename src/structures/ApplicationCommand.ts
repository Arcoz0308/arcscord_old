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
    options: Array<ApplicationCommandOption | ApplicationCommandOptionWithSubCommand>;
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
    options?: Array<ApplicationCommandOption | ApplicationCommandOptionWithSubCommand>;
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

export interface ApplicationCommandOptionWithSubCommand extends ApplicationCommandOption {
    /**
     * options of command subCommand/subCommandGroup
     */
    options?: ApplicationCommandOptionWithSubCommand;
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
    value: string | number;
}

export type ApplicationCommandOptionsType = keyof typeof ApplicationCommandOptionsTypes;

export class ApplicationCommand extends Base {
    /**
     * the id of the command
     */
    public id!: Snowflake;
    
    /**
     * the guild of the command (is null for global commands)
     */
    public guild!: Guild | null;
    
    /**
     * the name of the command
     */
    public name!: string;
    
    /**
     * the description of the command
     */
    public description!: string;
    
    /**
     * the options of the command
     */
    public options!: ApplicationCommandOption[] | null;
    
    /**
     * if the command is enable by default on add guild
     */
    public defaultPermission!: boolean;
    /**
     * @internal
     */
    public data: { [index: string]: any };
    
    constructor(client: Client, data: {[index: string]: any}) {
        super(client);
        this.id = data.id;
        this.guild = data['guild_id'] ? client.guilds.get(data['guild_id']) || null : null;
        this.name = data.name;
        this.description = data.description;
        this.options = data.options ? data.options as unknown as ApplicationCommandOption[] : null;
        this.defaultPermission = typeof data.default_permission !== 'undefined' ? data.default_permission : true;
        this.data = data;
    }
    
    public edit(data: EditApplicationCommandOptions, cache = true): Promise<ApplicationCommand> {
        return this.client.editApplicationCommand(this.id, data, cache);
    }
    
    public toString(): string {
        return `${this.name} : ${this.description}`;
    }
    
    public toJSON(space = 1): string {
        return JSON.stringify({
            id: this.id,
            application_id: this.client.user?.id || undefined,
            guild_id: this.guild ? this.guild.id : undefined,
            name: this.name,
            description: this.description,
            options: this.options || undefined,
            default_permission: this.defaultPermission
        }, null, space);
    }
    
    _patchData(data: { [index: string]: any }) {
        this.id = data.id;
        this.guild = data['guild_id'] ? this.client.guilds.get(data['guild_id']) || null : null;
        this.name = data.name;
        this.description = data.description;
        this.options = data.options ? data.options as unknown as ApplicationCommandOption[] : null;
        this.defaultPermission = typeof data.default_permission !== 'undefined' ? data.default_permission : true;
        this.data = data;
    };
}

/**
 * @internal
 */
export function resolveApplicationCommandForApi(cmd: {[index: string]: any}): object {
    if (cmd.hasOwnProperty('options')) cmd['options'] = resolveApplicationCommandOptionsForApi([cmd['options']]);
    return cmd;
}

/**
 * @internal
 */
function resolveApplicationCommandOptionsForApi(options: {[index: string]: any}[]): object[] {
    const newOptions = [];
    for (let option of options) {
        if (option['options']) option['options'] = resolveApplicationCommandOptionsForApi(option['options']);
        option['type'] = ApplicationCommandOptionsTypes[option['type']];
        newOptions.push(option);
    }
    return newOptions;
}