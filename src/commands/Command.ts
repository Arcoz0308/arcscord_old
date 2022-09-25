import { APIAllowedMentions, APIEmbed } from 'discord-api-types/v10';
import { CommandInteractionContext } from './interaction';
import { translatable, translations } from './translatable';


export enum CommandTypes {
    CHAP_INPUT = 1,
    USER,
    MESSAGE
}

export interface CommandReply {
    tts?: boolean;
    content?: string;
    embeds?: APIEmbed[];
    allowedMentions?: APIAllowedMentions;
    
}

export interface Command {
    translatable?: translatable;
}

export abstract class Command {
    public name?: string;
    public localesName?: translations;
    public description?: string;
    public localesDescription?: translations;
    public commandType: CommandTypes = CommandTypes.CHAP_INPUT;
    
    
    abstract execute(ctx: CommandInteractionContext): void;
    
    reply(ctx: CommandInteractionContext, r: CommandReply) {
    }
}

@User
@Name('avatar')
@LocalesName(
    {
        'fr': 'pdp'
    }
)
class Avatar extends Command {
    public execute(ctx: CommandInteractionContext): void {
    
    }
}

export function User(constructor: typeof Command) {
    constructor.prototype.commandType = CommandTypes.USER;
}

export function Message(constructor: typeof Command) {
    constructor.prototype.commandType = CommandTypes.MESSAGE;
}

export function Name(name: string) {
    return function(constructor: typeof Command) {
        constructor.prototype.name = name;
    };
}

export function LocalesName(names: translations) {
    return function(constructor: typeof Command) {
        constructor.prototype.localesName = names;
    };
}

export function Description(description: string) {
    return function(constructor: typeof Command) {
        constructor.prototype.description = description;
    };
}

export function LocalesDescription(descriptions: translations) {
    return function(constructor: typeof Command) {
        constructor.prototype.localesDescription = descriptions;
    };
}

