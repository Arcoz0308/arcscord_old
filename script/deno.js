const {existsSync, mkdirSync, readdirSync, lstatSync} = require('fs');
const {resolve} = require('path');
const input = resolve(__dirname, '../src/'),
    output = resolve(__dirname, '../deno/');

if (!existsSync(output)) mkdirSync(output);

function isDir(path) {
    return existsSync(path) && lstatSync(path).isDirectory();
}
function convertImports(filePath, fileContent) {
    fileContent = fileContent.replace(/from '(.*)'/g, (_, importPath) => {
        if(isDir(resolve(filePath, importPath))) return `from '${importPath.endsWith('/') ? importPath : importPath + '/'}mod.ts'`;
    })
}