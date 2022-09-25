import { GatewayInteractionCreateDispatch } from 'discord-api-types/v10';
import { EventHandler } from './EventHandler';


export class INTERACTION_CREATED extends EventHandler {
    public async handle(d: GatewayInteractionCreateDispatch) {
    
    }
}