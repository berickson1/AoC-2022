import { puzzleInput as input } from './input';
//import input from './input';

type Point = [number, number]
type Direction = "L" | "D" | "U" | "R"
interface Instruction {
    direction: Direction;
    count: number;
}

function parseInstructions(input: string): Instruction[] {
    return input.split('\n').map(line => {
        return {
            direction: line[0] as Direction,
            count: parseInt(line.substring(2), 10)
        }
    })
}

// bottom left is 0,0
function moveHeadPoint(instruction: Instruction, point: Point): Point {
    switch (instruction.direction) {
        case 'L':
            return [point[0] - 1, point[1]];
        case 'R':
            return [point[0] + 1, point[1]];
        case 'U':
            return [point[0], point[1] + 1];
        case 'D':
            return [point[0], point[1] - 1];
    }
}

function followTailPoint(headPoint: Point, tailPoint: Point): Point {
    const xDiff = headPoint[0] - tailPoint[0];
    const yDiff = headPoint[1] - tailPoint[1];


    let newX = headPoint[0];
    let newY = headPoint[1];

    if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1) {
        return tailPoint;
    }

    // Pull tail up or down
    if (yDiff > 1) {
        newY--;
    }
    if (yDiff < -1) {
        newY++;
    }
    // Pull tail left or right
    if (xDiff > 1) {
        newX--;
    }
    if (xDiff < -1) {
        newX++;
    }
    return [newX, newY]
}

function parseInput(input: string): Map<number, Set<number>> {
    const tailPoints: Map<number, Set<number>> = new Map();;
    const instructions = parseInstructions(input);
    let headPosition: Point = [0, 0];
    let tailPosition: Point = [0, 0];

    for (const instruction of instructions) {
        for (let i = 0; i < instruction.count; i++) {
            headPosition = moveHeadPoint(instruction, headPosition);
            tailPosition = followTailPoint(headPosition, tailPosition);
            let tailSet = tailPoints.get(tailPosition[1]);
            if (!tailSet) {
                tailSet = new Set();
            }
            tailSet.add(tailPosition[0])

            tailPoints.set(tailPosition[1], tailSet);
        }

    }
    return tailPoints;
}

function parseInput2(input: string): Map<number, Set<number>> {
    const tailPoints: Map<number, Set<number>> = new Map();;
    const instructions = parseInstructions(input);
    let headPosition: Point = [0, 0];
    let tailPosition: Point[] = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    for (const instruction of instructions) {
        for (let i = 0; i < instruction.count; i++) {
            headPosition = moveHeadPoint(instruction, headPosition);
            for (let j = 0; j < tailPosition.length; j++) {
                const tail = tailPosition[j];
                if (j === 0) {
                    tailPosition[j] = followTailPoint(headPosition, tail);
                } else {
                    tailPosition[j] = followTailPoint(tailPosition[j - 1], tail);
                }
            }
            let tailSet = tailPoints.get(tailPosition[tailPosition.length - 1][1]);
            if (!tailSet) {
                tailSet = new Set();
            }
            tailSet.add(tailPosition[tailPosition.length - 1][0])

            tailPoints.set(tailPosition[tailPosition.length - 1][1], tailSet);
        }

    }
    return tailPoints;
}

const coveredSquares = parseInput(input);

{
    let count = 0;
    for (const row of coveredSquares) {
        for (const item of row[1]) {
            count++
        }

    }
    console.log(`part 1: ${count}`);
}


const coveredSquares2 = parseInput2(input);

{
    let count = 0;
    for (const row of coveredSquares2) {
        for (const item of row[1]) {
            count++
        }

    }
    console.log(`part 2: ${count}`);
}