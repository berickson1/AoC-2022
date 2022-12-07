import { puzzleInput as input } from './input';
//import input from './input';

type Command = {
    inputBase: 'cd',
    arg: string,
    output?: never;
} | {
    inputBase: 'ls';
    output: ({
        type: 'dir',
        name: string
    } |
    {
        type: 'file',
        name: string,
        size: number
    })[]
}

function parseConsole(input: string): Command[] {
    const commands: Command[] = [];
    const rawConsole = input.split('$ ');
    rawConsole.shift();
    for (const consoleGroup of rawConsole) {
        switch (consoleGroup.substring(0, 2)) {
            case 'cd':
                commands.push({
                    inputBase: 'cd',
                    arg: consoleGroup.substring(3, consoleGroup.length - 1),
                });
                break;
            case 'ls':
                commands.push({
                    inputBase: 'ls',
                    output: consoleGroup.split('\n').slice(1, -1).map(item => {
                        const [partOne, name] = item.split(' ');
                        if (partOne === 'dir') {
                            return { type: partOne, name }
                        } else {
                            return { type: 'file', size: parseInt(partOne, 10), name }
                        }
                    })
                });
                break;
        }
    }
    return commands
}

function buildDirStruct(input: string): Map<string, number> {
    const filesystemMap = new Map<string, number>();
    const commands = parseConsole(input);
    let currentPath: string[] = [];
    for (const command of commands) {
        switch (command.inputBase) {
            case 'cd':
                if (command.arg == '..') {
                    currentPath.pop();
                } else if (command.arg === '/') {
                    currentPath = []
                } else {
                    currentPath.push(command.arg)
                }
                break;
            case 'ls': {
                for (const output of command.output) {
                    currentPath.push(output.name);
                    if (output.type === 'file') {
                        filesystemMap.set(currentPath.join('/'), output.size);
                    }
                    currentPath.pop()
                }
                break;
            }
        }
    }
    return filesystemMap;
}

function computeDirSizes(dirStruct: Map<string, number>): Map<string, number> {
    const dirMap = new Map<string, number>();
    for (const [filePath, fileSize] of dirStruct) {
        let rootDirSize = dirMap.get('/') ?? 0;
        rootDirSize += fileSize;
        dirMap.set('/', rootDirSize);
        const filePathParts = filePath.split('/');
        filePathParts.pop();
        let currentPath = [];
        for (const pathPart of filePathParts) {
            currentPath.push(pathPart)
            let currDirSize = dirMap.get(currentPath.join('/')) ?? 0;
            currDirSize += fileSize;
            dirMap.set(currentPath.join('/'), currDirSize);
        }
    }

    return dirMap;
}

function calcSumLessThan(dirSizes: Map<string, number>, maxSize: number): number {
    let sum = 0;
    for (const [_, size] of dirSizes) {
        if (size <= maxSize) {
            sum += size;
        }

    }
    return sum;

}

function findSmallestDirectoryLargerThan(dirSizes: Map<string, number>, minSize: number): number {
    let smallestDir = dirSizes.get('/')!;
    for (const [_, size] of dirSizes) {
        if (size >= minSize && size < smallestDir) {
            smallestDir = size;
        }

    }
    return smallestDir;

}

const dirStruct = buildDirStruct(input)
const dirSizes = computeDirSizes(dirStruct);

{
    console.log(`part 1: ${calcSumLessThan(dirSizes, 100000)}`);
}

{
    const usedFs = dirSizes.get('/');
    const neededSize = -1 * (70000000 - usedFs! - 30000000);

    console.log(`part 2: ${findSmallestDirectoryLargerThan(dirSizes, neededSize)}`);
}