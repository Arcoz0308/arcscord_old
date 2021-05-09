import {Client} from "../Client";
import axios, {AxiosInstance, Method} from "axios";
import {BASE_URL} from "./EndPoints";
import {RequestError} from "../errors/Errors";

export class RequestHandler {
    private _client: Client;
    private readonly _instance: AxiosInstance;
    public constructor(client: Client) {
        this._client = client;
        this._instance = axios.create({
            baseURL: BASE_URL,
            timeout: 1000,
            headers: {
                "Authorization": client.token,
            }
        });
    }
    public async request(method: Method, url: string, data?: any): Promise<any> {
        const response = await this._instance({
            url: url,
            method: method,
            data: data
        }).catch(e => {
            switch (e.code) {
                case "400":
                    return new RequestError('BAD REQUEST (code: 400)', method, url, data, e.code);
                    break;
                case "401":
                    return new RequestError('UNAUTHORIZED (code: 401)', method, url, data, e.code);
                    break;
                case "403":
                    return new RequestError('FORBIDDEN (code: 403)', method, url, data, e.code);
                    break;
                case "404":
                    return new RequestError('NOT FOUND (code: 4o4)', method, url, data, e.code);
                    break;
                case "405":
                    return new RequestError('METHOD NOT ALLOWED (code: 405)', method, url, data, e.code);
                    break;
                case "429":
                    return new RequestError('TOO MANY REQUESTS (code: 429)', method, url, data, e.code);
                    break;
                case "502":
                    return new RequestError('GATEWAY UNAVAILABLE (code: 502)', method, url, data, e.code);
                    break;
                default:
                    return new RequestError(`UNKNOW ERROR CODE (code: ${e.code})`, method, url, data, e.code);
                    break;
            }
        });
        if (response instanceof RequestError) return response;
        if (response) return response.data;
        else return new RequestError('no response from api',method, url, data);
    }
}