import { puzzleInput as input } from './input';
//import input from './input';

type Stack = Array<string>;
interface Move {
    from: number;
    to: number;
    count: number;
}

function parseStackInfo(input: string): Stack[] {
    const numStacks = (input.split('\n')[0].length + 1) / 4
    const stacks: Stack[] = [];
    for (const row of input.split('\n')) {
        for (let i = 0; i < numStacks; i++) {
            const char = row[(i * 4) + 1];
            if (char !== ' ') {
                if (!stacks[i]) {
                    stacks[i] = [];
                }
                stacks[i].push(char);
            }
        }
    }

    for (const stack of stacks) {
        // Remove row
        stack.pop();
        // reverse for push/pop style operations
        stack.reverse();
    }
    return stacks;
}

const parseRegex = /move (.*) from (.*) to (.*)/;
function parseMoves(input: string): Move[] {
    const moves: Move[] = [];
    const rawMoves = input.split('\n');
    for (const move of rawMoves) {
        const match = parseRegex.exec(move);
        if (!match) {
            throw new Error('bad');
        }

        moves.push({
            count: parseInt(match[1], 10),
            from: parseInt(match[2], 10),
            to: parseInt(match[3], 10)
        })

    }

    return moves;

}

function parseInput(input: string): [stacks: Stack[], moves: Move[]] {
    const [stackInfo, moveInfo] = input.split('\n\n');
    return [parseStackInfo(stackInfo), parseMoves(moveInfo)]


}

function executeMoves(stacks: Stack[], moves: Move[], moveStack = false): void {

    for (const move of moves) {
        if (moveStack) {
            const stack = stacks[move.from - 1];
            const toMove = stack.splice(stack.length - move.count, move.count);
            stacks[move.to - 1].push(...toMove);
        } else {
            for (let count = 0; count < move.count; count++) {
                const toMove = stacks[move.from - 1].pop();
                stacks[move.to - 1].push(toMove);
            }
        }
    }
}

let result = '';
{
    const splitInput = input.split('\n');
    const [stacks, moves] = parseInput(input);
    executeMoves(stacks, moves);

    for (const stack of stacks) {
        result += stack[stack.length - 1]
    }
    console.log('part 1: ' + result)
}

result = ''
const splitInput = input.split('\n');
const [stacks, moves] = parseInput(input);
executeMoves(stacks, moves, true);

for (const stack of stacks) {
    result += stack[stack.length - 1]
}

console.log('part 2: ' + result)