import { Base } from './Base';
import { Client } from '../Client';
import { APIGuild } from 'discord-api-types';
import { Snowflake } from '../utils/Utils';
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
