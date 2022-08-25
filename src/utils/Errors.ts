export class RequestError extends Error {
    public method: string;
    public url: string;
    public data?: any;
    public status?: string;
    public msg?: string;
    
    constructor(
        message: string,
        method: string,
        url: string,
        data?: any,
        status?: string,
        msg?: string
    ) {
        message += `
debug: 
url : ${url}
data : ${data}
status : ${status}
message : ${msg}`;
        super(message);
        this.method = method;
        this.url = url;
        this.data = data;
        this.status = status;
        this.msg = msg;
    }
}

export class InvalidTokenError extends Error {
    constructor(message: string = 'Your token are invalid !') {
        super(message);
    }
}

export class GatewayAlreadyConnectedError extends Error {
    constructor(message: string = 'the bot is already connected !') {
        super(message);
    }
}