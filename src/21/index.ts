import { puzzleInput as input } from './input';
//import input from './input';

enum Operation {
    Constant,
    Add,
    Subtract,
    Multiple,
    Divide
}

interface Monkey {
    name: string
    operation: Operation,
    left: string | undefined,
    right: string | undefined,
    output: number | undefined
}

function getOutput(monkeyMap: Map<string, Monkey>, monkeyName: string, cache = true): number {
    const monkeyInfo = monkeyMap.get(monkeyName)!;
    if (monkeyInfo.output !== undefined) {
        return monkeyInfo.output;
    }

    let output: number;

    switch (monkeyInfo.operation) {
        case Operation.Add:
            {
                output = getOutput(monkeyMap, monkeyInfo.left!) + getOutput(monkeyMap, monkeyInfo.right!)
                break;
            }
        case Operation.Subtract:
            {
                output = getOutput(monkeyMap, monkeyInfo.left!) - getOutput(monkeyMap, monkeyInfo.right!)
                break;
            }
        case Operation.Multiple:
            {
                output = getOutput(monkeyMap, monkeyInfo.left!) * getOutput(monkeyMap, monkeyInfo.right!)
                break;
            }
        case Operation.Divide:
            {
                output = getOutput(monkeyMap, monkeyInfo.left!) / getOutput(monkeyMap, monkeyInfo.right!)
                break;
            }
        default:
            throw new Error('unknown')
    }
    if (cache) {
        //monkeyInfo.output = output;
    }
    return output;
}

function solveFor(monkeyMap: Map<string, Monkey>, monkeyName: string, from: string, output: number): number {
    if (from === monkeyName) {
        return output;
    }
    const monkeyInfo = monkeyMap.get(from)!;
    if (monkeyInfo.output !== undefined) {
        return monkeyInfo.output;
    }

    let leftOutput = getOutput(monkeyMap, monkeyInfo.left!, false);
    let rightOutput = getOutput(monkeyMap, monkeyInfo.right!, false);

    // solve for left
    // output = left <op> right
    // left = output <invOp> right

    if (isNaN(leftOutput)) {
        let leftVal: number;
        switch (monkeyInfo.operation) {
            case Operation.Add:
                {
                    leftVal = output - rightOutput
                    break;
                }
            case Operation.Subtract:
                {
                    leftVal = output + rightOutput
                    break;
                }
            case Operation.Multiple:
                {
                    leftVal = output / rightOutput
                    break;
                }
            case Operation.Divide:
                {
                    leftVal = output * rightOutput
                    break;
                }
            default:
                throw new Error('unknown')
        }
        return solveFor(monkeyMap, monkeyName, monkeyInfo.left!, leftVal);
    } else if (isNaN(rightOutput)) {

        // OR solve for right
        // right = left - output <minus>
        // right = output - left <plus>
        // right = output / left <mult>
        // right = left / output <div>
        let rightVal: number;
        switch (monkeyInfo.operation) {
            case Operation.Add:
                {
                    rightVal = output - leftOutput
                    break;
                }
            case Operation.Subtract:
                {
                    rightVal = leftOutput - output
                    break;
                }
            case Operation.Multiple:
                {
                    rightVal = output / leftOutput
                    break;
                }
            case Operation.Divide:
                {
                    rightVal = leftOutput / output
                    break;
                }
            default:
                throw new Error('unknown')
        }
        return solveFor(monkeyMap, monkeyName, monkeyInfo.right!, rightVal);
    } else {
        throw new Error('Unknown')
    }
}


const monkeys: Monkey[] = input.split('\n').map(val => {
    const [name, rest] = val.split(': ');
    let operation: Operation;
    let left: string | undefined;
    let right: string | undefined;
    let output: number | undefined;
    if (rest.includes(' + ')) {
        operation = Operation.Add;
        [left, right] = rest.split(' + ');
    } else if (rest.includes(' - ')) {
        operation = Operation.Subtract;
        [left, right] = rest.split(' - ');
    } else if (rest.includes(' * ')) {
        operation = Operation.Multiple;
        [left, right] = rest.split(' * ');
    } else if (rest.includes(' / ')) {
        operation = Operation.Divide;
        [left, right] = rest.split(' / ');
    } else {
        operation = Operation.Constant;
        output = parseInt(rest, 10)
    }
    return {
        name,
        operation,
        left,
        right,
        output
    }
});
{
    const monkeyMap = new Map<string, Monkey>(JSON.parse(JSON.stringify(monkeys)).map((monkey: Monkey) => [monkey.name, monkey]));

    console.log(getOutput(monkeyMap, 'root'));
}

{
    const monkeyMap2 = new Map<string, Monkey>(JSON.parse(JSON.stringify(monkeys)).map((monkey: Monkey) => [monkey.name, monkey]));
    const human = monkeyMap2.get('humn')!;
    human.operation = Operation.Constant;
    human.left = undefined;
    human.right = undefined;
    human.output = 'x' as any;
    const root = monkeyMap2.get('root')!;
    const left = getOutput(monkeyMap2, root.left!, false)
    const right = getOutput(monkeyMap2, root.right!, false)

    // Right side is val to match
    console.log(left, right)
    console.log(solveFor(monkeyMap2, 'humn', root.left!, right))
}