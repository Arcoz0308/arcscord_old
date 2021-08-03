const {existsSync, mkdirSync, readdirSync, lstatSync, accessSync, readFileSync, writeFileSync, rmSync} = require('fs');
const {resolve, sep} = require('path');
const input = resolve(__dirname, '../src/'),
    output = resolve(__dirname, '../deno/src/');
const ignorePaths = [
    resolve(__dirname, '../deno/.idea/'),
    resolve(__dirname, '../deno/config.ts'),
    resolve(__dirname, '../deno/tests/')
];
const denoFiles = [];
if (!existsSync(output)) mkdirSync(output);
function isDir(path) {
    return existsSync(path) && lstatSync(path).isDirectory();
}
function convertImports(filePath, fileContent) {
    return  fileContent.replace(/from '(.*)'/g, (_, importPath) => {
        if(isDir(resolve(filePath.split(sep).slice(0, -1).join(sep), importPath))) return `from '${importPath.endsWith('/') ? importPath : importPath + '/'}mod.ts'`;
        if (importPath === 'discord-api-types') return 'from \'https://deno.land/x/discord_api_types/v9.ts\'';
        return `from '${importPath}.ts'`;
    });
}
function readDir(dirPath) {
    if (!existsSync(dirPath.replace(input, output))) mkdirSync(dirPath.replace(input, output));
    for (const dir of readdirSync(dirPath, {withFileTypes: true})) {
        if (dir.isDirectory()) {
            readDir(dirPath + sep + dir.name);
        } else {
            if (!dir.name.endsWith('.ts')) continue;
            if (dir.name.endsWith('.deno.ts')) denoFiles.push(dir.name.replace('.deno', ''));
            if (denoFiles.includes(dir.name)) continue;
            copyfile(dirPath + sep + dir.name);
        }
    }
}
function copyfile(path) {
    console.log(`convert file "${path}"...`)
    let content = readFileSync(path, {
        encoding: 'utf-8'
    });
    content = convertImports(path, content);
    if (path.endsWith('.deno.ts')) {
        if (content.startsWith('//ts-ignore')) content = content.split('\n').slice().join('\n');
        path = path.replace(input, output).replace('.deno', '');
    } else path = path.replace(input, output);
    if (path.endsWith('index.ts')) path = path.replace('index.ts', 'mod.ts')
    writeFileSync(path, content, {
        encoding: 'utf-8'
    });
}

console.log('start conversion...')
if (existsSync(output)) rmSync(output, {
    recursive: true
});
readDir(input);
console.log('conversion ended !')