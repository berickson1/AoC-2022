import { puzzleInput as input } from './input';
//import input from './input';

enum Direction {
    Right,
    Down,
    Left,
    Up,
    Noop,
}

enum FaceName {
    Top,
    Front,
    Bottom,
    Back,
    Left,
    Right,
}

interface Point {
    x: number,
    y: number,
}

interface PointWithDirection extends Point {
    direction: Direction
}

interface Face {
    cells: Cell[][],
    id: FaceName,
    entry: Point,
}

interface Instruction {
    direction: Direction,
    count: number;
}

interface Walker {
    positionX: number,
    positionY: number,
    direction: Direction
}
type Cell = '.' | '#' | undefined;

type PuzzleMap = Cell[][];

type PuzzleMap3d = Face[];

function getMaxX(map: PuzzleMap): number {
    let maxX = 0;
    for (const row of map) {
        maxX = Math.max(maxX, row.length)
    }
    return maxX;
}

function move(map: PuzzleMap, walker: Walker, instruction: Instruction): void {
    for (let i = 0; i < instruction.count; i++) {
        const next = nextPoint(map, walker.positionX, walker.positionY, walker.direction)
        if (!next) {
            break;
        }
        walker.positionX = next.x;
        walker.positionY = next.y;
    }

    // Turn the walker
    if (instruction.direction === Direction.Left) {
        switch (walker.direction) {
            case Direction.Down:
                walker.direction = Direction.Right
                break;
            case Direction.Up:
                walker.direction = Direction.Left
                break;
            case Direction.Left:
                walker.direction = Direction.Down
                break;
            case Direction.Right:
                walker.direction = Direction.Up
                break;
        }
    } else if (instruction.direction === Direction.Right) {
        switch (walker.direction) {
            case Direction.Down:
                walker.direction = Direction.Left
                break;
            case Direction.Up:
                walker.direction = Direction.Right
                break;
            case Direction.Left:
                walker.direction = Direction.Up
                break;
            case Direction.Right:
                walker.direction = Direction.Down
                break;
        }

    }
}

function move3d(map: PuzzleMap, walker: Walker, instruction: Instruction): void {
    for (let i = 0; i < instruction.count; i++) {
        const next = nextPoint3d(map, walker.positionX, walker.positionY, walker.direction)
        if (!next) {
            break;
        }
        walker.positionX = next.x;
        walker.positionY = next.y;
        walker.direction = next.direction;
    }

    // Turn the walker
    if (instruction.direction === Direction.Left) {
        switch (walker.direction) {
            case Direction.Down:
                walker.direction = Direction.Right
                break;
            case Direction.Up:
                walker.direction = Direction.Left
                break;
            case Direction.Left:
                walker.direction = Direction.Down
                break;
            case Direction.Right:
                walker.direction = Direction.Up
                break;
        }
    } else if (instruction.direction === Direction.Right) {
        switch (walker.direction) {
            case Direction.Down:
                walker.direction = Direction.Left
                break;
            case Direction.Up:
                walker.direction = Direction.Right
                break;
            case Direction.Left:
                walker.direction = Direction.Up
                break;
            case Direction.Right:
                walker.direction = Direction.Down
                break;
        }

    }
}

function nextPoint(map: PuzzleMap, x: number, y: number, direction: Direction): Point | undefined {
    let nextX = x;
    let nextY = y;
    switch (direction) {
        case Direction.Down:
            nextY = y + 1;
            break;
        case Direction.Up:
            nextY = y - 1;
            break;
        case Direction.Left:
            nextX = x - 1;
            break;
        case Direction.Right:
            nextX = x + 1;
            break;
    }

    // Wrap if needed
    const maxX = getMaxX(map);
    nextY = (nextY + map.length) % map.length;
    nextX = (nextX + maxX) % maxX;

    let rawNextCell: Cell = map[nextY][nextX];
    // Skip the gap
    if (rawNextCell === undefined) {
        return nextPoint(map, nextX, nextY, direction)
    }
    // Hit a wall, stop
    if (rawNextCell === '#') {
        return undefined;
    }
    return { x: nextX, y: nextY };
}

const mapWidth = 50;

function nextPoint3d(map: PuzzleMap, x: number, y: number, direction: Direction): PointWithDirection | undefined {
    let nextX = x;
    let nextY = y;
    switch (direction) {
        case Direction.Down:
            nextY = y + 1;
            break;
        case Direction.Up:
            nextY = y - 1;
            break;
        case Direction.Left:
            nextX = x - 1;
            break;
        case Direction.Right:
            nextX = x + 1;
            break;
    }

    let rawNextCell: Cell = map[nextY]?.[nextX];

    // Hit a wall, stop
    if (rawNextCell === '#') {
        return undefined;
    } else if (rawNextCell === '.') {
        return { x: nextX, y: nextY, direction };
    }

    // Turn a corner?
    // wrap across x axis
    if (nextX / mapWidth !== x / mapWidth) {
        if (nextY >= 0 && nextY < 50) {
            if (nextX === 49) { //1
                nextX = 0
                nextY = 149 - nextY
                direction = Direction.Right
            } else if (nextX === 150) { //2
                nextX = 99
                nextY = 149 - nextY
                direction = Direction.Left
            }
        } else if (nextY >= 50 && nextY < 100) { //3
            if (nextX === 49) {
                nextX = nextY - 50
                nextY = 100
                direction = Direction.Down
            } else if (nextX === 100) { //3
                nextX = nextY + 50
                nextY = 49
                direction = Direction.Up
            }
        } else if (nextY >= 100 && nextY < 150) { //4
            if (nextX === -1) {
                nextX = 50
                nextY = 149 - nextY
                direction = Direction.Right
            } else if (nextX === 100) { //5
                nextX = 149
                nextY = 149 - nextY
                direction = Direction.Left
            }
        } else if (nextY >= 150 && nextY < 200) { //6
            if (nextX === -1) {
                nextX = nextY - 100
                nextY = 0
                direction = Direction.Down
            } else if (nextX === 50) {//6
                nextX = nextY - 100
                nextY = 149
                direction = Direction.Up
            }
        }
    } else if (nextY / mapWidth !== y / mapWidth) {
        // wrap across y axis
        if (nextX >= 0 && nextX < 50) {
            if (nextY === 99) { //4
                nextY = 50 + nextX
                nextX = 50
                direction = Direction.Right
            } else if (nextY === 200) { //6
                nextX = nextX + 100
                nextY = 0
                direction = Direction.Down
            }
        } else if (nextX >= 50 && nextX < 100) {//1
            if (nextY === -1) {
                nextY = nextX + 100
                nextX = 0
                direction = Direction.Right
            } else if (nextY === 150) {//5
                nextY = nextX + 100
                nextX = 49
                direction = Direction.Left
            }
        } else if (nextX >= 100 && nextX < 150) {//2
            if (nextY === -1) {
                nextX = nextX - 100
                nextY = 199
                direction = Direction.Up
            } else if (nextY === 50) {//2
                nextY = nextX - 50
                nextX = 99
                direction = Direction.Left
            }
        }
    }
    rawNextCell = map[nextY]?.[nextX];

    // Hit a wall, stop
    if (rawNextCell === '#') {
        return undefined;
    } else if (rawNextCell === '.') {
        return { x: nextX, y: nextY, direction };
    }

    throw new Error('unknown')

}


const [rawPuzzle, rawCode] = input.split('\n\n');
const puzzle: PuzzleMap = rawPuzzle.split('\n').map(val => {
    const rowData: Cell[] = [];
    const colVals = val.split('');
    for (let i = 0; i < colVals.length; i++) {
        const colVal = colVals[i];
        if (colVal === ' ') {
            rowData.push(undefined);
        } else {
            rowData.push(colVal as Cell);
        }

    }
    return rowData;
})
const code: Instruction[] = [];
let numberCollector = '';
let directionCollector: Direction | undefined;
for (const char of rawCode) {
    if (char >= '0' && char <= '9') {
        numberCollector += char;
        continue;
    }
    if (char === 'L') {
        directionCollector = Direction.Left;
    } else if (char === 'R') {
        directionCollector = Direction.Right;
    }
    code.push({ direction: directionCollector!, count: parseInt(numberCollector, 10) });
    numberCollector = '';
    directionCollector = undefined;
}

if (numberCollector && directionCollector === undefined) {
    code.push({ direction: Direction.Noop, count: parseInt(numberCollector, 10) });
}
{
    // Start at top left
    const mazeWalker: Walker = { positionX: puzzle[0].findIndex(val => val === '.'), positionY: 0, direction: Direction.Right };

    for (const instruction of code) {
        move(puzzle, mazeWalker, instruction)
    }

    const sum = (1000 * (mazeWalker.positionY + 1)) + (4 * (mazeWalker.positionX + 1)) + mazeWalker.direction;
    console.log(sum)
}
{
    const mazeWalker: Walker = { positionX: puzzle[0].findIndex(val => val === '.'), positionY: 0, direction: Direction.Right };

    for (const instruction of code) {
        move3d(puzzle, mazeWalker, instruction)
    }

    const sum = (1000 * (mazeWalker.positionY + 1)) + (4 * (mazeWalker.positionX + 1)) + mazeWalker.direction;
    console.log(sum)
}