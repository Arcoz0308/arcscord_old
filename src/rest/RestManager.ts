import axios, { AxiosInstance, Method } from 'axios';
import { Client } from '../Client';
import { RequestError } from '../utils/Errors';
import { BASE_URL } from './EndPoints';

//TODO rate limit
export class RestManager {
    private _client: Client;
    private readonly _instance: AxiosInstance;
    
    public constructor(client: Client) {
        this._client = client;
        this._instance = axios.create({
            baseURL: BASE_URL,
            timeout: 1000,
            headers: {
                Authorization: client.bot
                    ? client.token.startsWith('Bot ')
                        ? client.token
                        : 'Bot ' + client.token
                    : client.token
            }
        });
    }
    
    public request(method: Method, url: string, data?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            
            const response = await this._instance({
                url: url,
                method: method,
                data: data
            }).catch((e) => {
                console.log(e);
                switch (e.response.data.code) {
                    case '400':
                        return reject(new RequestError(
                            'BAD REQUEST (code: 400)',
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                    case '401':
                        return reject(new RequestError(
                            'UNAUTHORIZED (code: 401)',
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                    case '403':
                        return reject(new RequestError(
                            'FORBIDDEN (code: 403)',
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                    case '404':
                        return reject(new RequestError(
                            'NOT FOUND (code: 4o4)',
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                    case '405':
                        return reject(new RequestError(
                            'METHOD NOT ALLOWED (code: 405)',
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                    case '429':
                        return reject(new RequestError(
                            'TOO MANY REQUESTS (code: 429)',
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                    case '502':
                        return reject(new RequestError(
                            'GATEWAY UNAVAILABLE (code: 502)',
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                    default:
                        return reject(new RequestError(
                            `UNKNOWN ERROR CODE (code: ${e.response.data.code})`,
                            method,
                            url,
                            data,
                            e.response.data.code,
                            e.response.data.message
                        ));
                }
            });
            if (response) resolve(response.data);
            else reject(new RequestError('no response from api', method, url, data));
        });
    }
}
