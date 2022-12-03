import { puzzleInput as input } from './input';
//import input from './input';

function getSackParts(input: string): [string, string] {
    return [input.substring(0, (input.length / 2)), input.substring((input.length / 2))];
}

function getCommonItem(left: string, right: string): string {
    const leftSet = new Set(left.split(''));
    for (const rightItem of right.split('')) {
        if (leftSet.has(rightItem)) {
            return rightItem;
        }
    }
    throw new Error('nope');
}


function getGroupBadge(one: string, two: string, three: string): string {
    const setOne = new Set(one.split(''));

    const commonOneTwo = new Set();
    for (const item of two.split('')) {
        if (setOne.has(item)) {
            commonOneTwo.add(item)
        }
    }

    for (const item of three.split('')) {
        if (commonOneTwo.has(item)) {
            return item;
        }
    }
    console.log(commonOneTwo)
    throw new Error('nope');
}

function getPriority(item: string): number {
    const charCode = item.charCodeAt(0);
    // a - z
    if (charCode >= 97) {
        return charCode - 97 + 1;
    }

    // A - Z
    return charCode - 65 + 27
}

let result = 0;

for (const item of input.split('\n')) {
    const val = getPriority(getCommonItem(...getSackParts(item)));
    result += val

}
console.log('part 1: ' + result)

result = 0;

const splitInput = input.split('\n')
for (let i = 0; i < splitInput.length; i = i + 3) {
    const group = [splitInput[i], splitInput[i + 1], splitInput[i + 2]] as const;
    const val = getPriority(getGroupBadge(...group));
    result += val;


}

console.log('part 2: ' + result)