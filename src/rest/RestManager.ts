import axios from 'axios';
import { Client } from '../Client';
import { RequestError } from '../utils/Errors';
import { BASE_URL } from './EndPoints';
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
            'Bot' + client.token;
    }
    request(method: Method, url: string, data?: object): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const response = await axios({
                method: method,
                baseURL: BASE_URL,
                url: url,
                data: data,
                headers: {
                    Authorization: this.token
                },
                timeout: 1000
            }).catch(e => {
                return reject(new RequestError('API ERROR', method, url, data, e.data.code, e.data.message));
            });
            resolve(response);
        });
    }
}