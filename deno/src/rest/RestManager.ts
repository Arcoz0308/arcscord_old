import { Client } from '../Client.ts';
import { BASE_URL } from './EndPoints.ts';
export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';
export interface rawRest {
    method: Method;
    url: string;
    data?: any;
    response: {
        status: number;
        data: any;
    }
    
}
export class RestManager {
    private token: string;
    
    constructor(client: Client) {
        this.token = client.token.startsWith('Bot ') ?
            client.token :
            'Bot ' + client.token;
    }
    request(method: Method, url: string, data?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(BASE_URL + url, {
                method: method,
                headers: {
                    'Authorization': this.token,
                    'content-type': 'content-type'
                },
                body: data
            }).catch(e => {
                return reject(`API ERROR : ${e.message}`);
            });
            if (response && response.ok) {
                resolve(await response.json());
            } else reject('unknown error on fetching api')
        })
    }
}