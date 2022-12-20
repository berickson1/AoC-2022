import { puzzleInput as input } from './input';
//import input from './input';

type Code = {
    id: number,
    val: number,
}

function insertAt(arr: Code[], index: number, val: Code) {
    while (index <= 0) {
        index = (index % arr.length) + arr.length
    }
    while (index > arr.length) {
        index = index % arr.length
    }
    arr.splice(index, 0, val);
}

function indexOf(arr: Code[], index: number): Code {
    while (index >= arr.length) {
        index = index % arr.length
    }
    while (index < 0) {
        index += arr.length
    }
    return arr[index];
}


function decrypt(input: string): Code[] {
    let currId = 1;
    const rawNumbers: Code[] = input.split('\n').map(val => { return { id: currId++, val: parseInt(val, 10) } });

    const sortedNumbers = [...rawNumbers];
    for (const numberToMove of rawNumbers) {
        const fromIndex = sortedNumbers.findIndex(val => val.id === numberToMove.id);
        const removedItem = sortedNumbers.splice(fromIndex, 1)[0];
        insertAt(sortedNumbers, fromIndex + removedItem.val, removedItem);
    }
    const zeroIndex = sortedNumbers.findIndex(val => val.val === 0);
    return [indexOf(sortedNumbers, zeroIndex + 1000), indexOf(sortedNumbers, zeroIndex + 2000), indexOf(sortedNumbers, zeroIndex + 3000)]
}


function decrypt2(input: string, decryptionKey: number): Code[] {
    let currId = 1;
    const rawNumbers: Code[] = input.split('\n').map(val => { return { id: currId++, val: parseInt(val, 10) * decryptionKey } });

    const sortedNumbers = [...rawNumbers];
    for (let i = 0; i < 10; i++) {
        for (const numberToMove of rawNumbers) {
            const fromIndex = sortedNumbers.findIndex(val => val.id === numberToMove.id);
            const removedItem = sortedNumbers.splice(fromIndex, 1)[0];
            insertAt(sortedNumbers, fromIndex + removedItem.val, removedItem);
        }
    }
    const zeroIndex = sortedNumbers.findIndex(val => val.val === 0);
    return [indexOf(sortedNumbers, zeroIndex + 1000), indexOf(sortedNumbers, zeroIndex + 2000), indexOf(sortedNumbers, zeroIndex + 3000)]
}

console.log(decrypt(input).map(val => val.val).reduce((prev, curr) => prev + curr));
console.log(decrypt2(input, 811589153).map(val => val.val).reduce((prev, curr) => prev + curr));