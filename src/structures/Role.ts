import { Base } from './Base';
import { Client } from '../Client';
import {
  APIRole,
  APIRoleTags
} from 'discord-api-types';
import { Snowflake } from '../utils/Snowflake';


/**
 * @category Structures
 */
export class Role extends Base {
  public id: Snowflake;
  public name: string;
  public color: number;
  public hoist: boolean;
  public position: number;
  public permissions: Snowflake;
  public managed: boolean;
  public mentionable: boolean;
  public tags: APIRoleTags | undefined;

  constructor(client: Client, data: APIRole) {
    super(client);

    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
    this.tags = data.tags;

  }

}