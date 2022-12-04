import { puzzleInput as input } from './input';
//import input from './input';

function hasIntersection(a: Set<number>, b: Set<number>): boolean {
    for (const item of a) {
        if (b.has(item)) {
            return true;
        }
    }
    return false;
}

function expandRange(input: string): number[] {
    const [start, end] = input.split('-');
    const result: number[] = [];
    for (let i = parseInt(start, 10); i <= parseInt(end, 10); i++) {
        result.push(i);
    }
    return result;
}

let result = 0;
const splitInput = input.split('\n');

for (let i = 0; i < splitInput.length; i++) {
    const [first, second] = splitInput[i].split(',');
    const partner1 = expandRange(first);
    const partner2 = expandRange(second);

    const setOne = new Set(partner1);
    const setTwo = new Set(partner2);

    for (const item of partner1) {
        setTwo.delete(item);
    }

    for (const item of partner2) {
        setOne.delete(item);
    }

    if (setOne.size === 0 || setTwo.size === 0) {
        result++;
    }

}
console.log('part 1: ' + result)

result = 0;

for (let i = 0; i < splitInput.length; i++) {
    const [first, second] = splitInput[i].split(',');
    const partner1 = expandRange(first);
    const partner2 = expandRange(second);

    const setOne = new Set(partner1);
    const setTwo = new Set(partner2);

    if (hasIntersection(setOne, setTwo)) {
        result++;
    }

}

console.log('part 2: ' + result)