import { APIGuild } from 'discord-api-types';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';
import { Member } from './Member';


/**
 * @category Structures
 */
export class Guild extends Base {
    public members = new Map<Snowflake, Member>();

    constructor(client: Client, data: APIGuild) {
        super(client);
    }
}
