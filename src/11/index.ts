import { puzzleInput as input } from './input';
//import input from './input';

interface Item {
    worryLevel: number,
    inspectionCount: number,
}

interface Monkey {
    id: number,
    items: Item[],
    divisor: number;
    causeWorry: (input: number) => number,
    conditional: (input: number) => number,
    inspectionCount: number,
}


const parseRegex = /Monkey (.*):\n.*items: (.*)\n.*Operation: new = old (.) (.*)\n.*divisible by (.*)\n.*true: throw to monkey (.*)\n.*false: throw to monkey (.*)/

function parseInput(input: string): Monkey[] {
    return input.split('\n\n').map(lineBlock => {
        const [_, id, items, operationOp, operationVal, divisibleBy, trueVal, falseVal] = parseRegex.exec(lineBlock)!;
        return {
            id: parseInt(id, 10),
            items: items.split(', ').map(a => {
                return {
                    inspectionCount: 0,
                    worryLevel: parseInt(a, 10)
                }
            }),
            causeWorry: input => {
                if (operationOp === '+') {
                    return input + parseInt(operationVal, 10);
                }
                if (operationVal === 'old') {
                    return input * input;
                }
                return input * parseInt(operationVal, 10);
            },
            divisor: parseInt(divisibleBy, 10),
            conditional: input => {
                if (input % parseInt(divisibleBy, 10) === 0) {
                    return parseInt(trueVal, 10);
                }
                return parseInt(falseVal, 10);
            },
            inspectionCount: 0,
        }
    })
}

function runForRounds(roundCount: number, monkeys: Monkey[]): number {
    for (let round = 0; round < roundCount; round++) {
        for (const monkey of monkeys) {
            let item: Item | undefined;
            while (!!(item = monkey.items.shift())) {
                item.inspectionCount++;
                monkey.inspectionCount++;
                item.worryLevel = Math.floor(monkey.causeWorry(item.worryLevel) / 3);
                monkeys[monkey.conditional(item.worryLevel)].items.push(item);
            }
        }
    }

    // find top 2
    const topTwo = monkeys.sort((a, b) => {
        return a.inspectionCount < b.inspectionCount ? 1 : -1;
    }).slice(0, 2);
    return topTwo[0].inspectionCount * topTwo[1].inspectionCount;
}

function runForRounds2(roundCount: number, monkeys: Monkey[]): number {
    const commonDivisor = monkeys.map(i => i.divisor).reduce((prev, curr) => prev * curr);
    for (let round = 0; round < roundCount; round++) {
        for (const monkey of monkeys) {
            let item: Item | undefined;
            while (!!(item = monkey.items.shift())) {
                item.inspectionCount++;
                monkey.inspectionCount++;
                item.worryLevel = monkey.causeWorry(item.worryLevel) % commonDivisor;
                monkeys[monkey.conditional(item.worryLevel)].items.push(item);
            }
        }
    }

    // find top 2
    const topTwo = monkeys.sort((a, b) => {
        return a.inspectionCount < b.inspectionCount ? 1 : -1;
    }).slice(0, 2);
    return topTwo[0].inspectionCount * topTwo[1].inspectionCount;
}

{
    const instructions = parseInput(input);
    console.log(`part 1: ${runForRounds(20, instructions)}`);
}

{
    const instructions = parseInput(input);
    console.log(`part 2: ${runForRounds2(10000, instructions)}`);
}