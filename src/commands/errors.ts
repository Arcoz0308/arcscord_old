export class NoNameError extends Error {
    constructor(message: string = 'Command don\'t have a name !, please definite one with @Name(\'name\') or name = \'name\';') {
        super(message);
    }
}