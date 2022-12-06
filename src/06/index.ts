import { puzzleInput as input } from './input';
//import input from './input';

function findStartOfPacketIndex(input: string, len: number): number {
    const trackedChars = [];
    let result = 0;
    for (const char of input) {
        result++;
        if (trackedChars.length >= len) {
            trackedChars.shift();
        }
        trackedChars.push(char);
        if (new Set(trackedChars).size === len) {
            return result;
        }
    }
    return -1;
}

{
    console.log(`part 1: ${findStartOfPacketIndex(input, 4)}`);
}

{
    console.log(`part 2: ${findStartOfPacketIndex(input, 14)}`);
}