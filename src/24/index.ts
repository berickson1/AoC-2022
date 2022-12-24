import { puzzleInput as input } from './input';
//import input from './input';

const directions = ['>', '^', '<', 'v'] as const;
type Cell = '#' | typeof directions[number] | number | '.';

type PuzzleMap = Cell[][];

interface Point {
    x: number;
    y: number;
}

enum Direction {
    Up = '^',
    Right = '>',
    Down = 'v',
    Left = '<',
    Stay = '$',
}

type Map = Cell[][];

interface Blizzard {
    id: number,
    location: Point;
    direction: Direction
}

interface Person {
    location: Point
}

const puzzle: PuzzleMap = input.split('\n').map(val => {
    const rowData: Cell[] = [];
    const colVals = val.split('');
    for (let i = 0; i < colVals.length; i++) {
        let colVal: string | number = colVals[i];
        rowData.push(colVal as Cell);

    }
    return rowData;
})

function isBlizzard(cell: string | number): cell is Direction {
    return directions.findIndex(val => val === cell) !== -1;
}

function getNextBizzardPoint(map: Map, blizzard: Blizzard): Point {
    let nextPoint: Point;
    switch (blizzard.direction) {
        case '^':
            nextPoint = { x: blizzard.location.x, y: blizzard.location.y - 1 }
            break;
        case 'v':
            nextPoint = { x: blizzard.location.x, y: blizzard.location.y + 1 }
            break;
        case '>':
            nextPoint = { x: blizzard.location.x + 1, y: blizzard.location.y }
            break;
        case '<':
            nextPoint = { x: blizzard.location.x - 1, y: blizzard.location.y }
            break;
        default:
            throw new Error();
    }

    // Wrap as needed
    if (nextPoint.x === 0) {
        nextPoint.x = map[0].length - 2
    } else if (nextPoint.x === map[0].length - 1) {
        nextPoint.x = 1
    } else if (nextPoint.y === 0) {
        nextPoint.y = map.length - 2
    } else if (nextPoint.y === map.length - 1) {
        nextPoint.y = 1
    }
    return nextPoint
}

const blizzards: Blizzard[] = [];
let blizzardId = 0;
for (let y = 0; y < puzzle.length; y++) {
    const row = puzzle[y];
    for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (isBlizzard(cell)) {
            blizzards.push({
                location: {
                    x,
                    y
                },
                direction: cell,
                id: blizzardId++,
            })
        }
    }
}

function isEqualPoint(point1: Point, point2: Point): boolean {
    return point1.x === point2.x && point1.y === point2.y;
}

function getNextPersonPoints(map: Map, blizzards: Blizzard[], person: Point): Point[] {
    const nextPoints: Point[] = []
    for (const direction of ['^', '>', 'v', '<', '$'] as const) {
        let nextPoint: Point | undefined;
        switch (direction) {
            case '^':
                nextPoint = {
                    y: person.y - 1,
                    x: person.x
                }
                break;
            case 'v':
                nextPoint = {
                    y: person.y + 1,
                    x: person.x
                }
                break;
            case '<':
                nextPoint = {
                    y: person.y,
                    x: person.x - 1
                }
                break;
            case '>':
                nextPoint = {
                    y: person.y,
                    x: person.x + 1
                }
                break;
            case '$':
                nextPoint = {
                    y: person.y,
                    x: person.x
                }
                break;
        }
        const mapPoint = map[nextPoint.y]?.[nextPoint.x];
        if (!mapPoint || mapPoint === '#') {
            nextPoint = undefined;
        }

        if (nextPoint && blizzards.some(blizzard => isEqualPoint(nextPoint!, blizzard.location))) {
            nextPoint = undefined
        }

        if (nextPoint) {
            nextPoints.push(nextPoint);
        }
    }
    return nextPoints;
}

function printMap(map: Map): void {
    console.clear();
    for (const row of map) {
        console.log(row.join(''));
    }
}

function pointToString(point: Point): string {
    return `${point.x},${point.y}`;
}
function stringToPoint(str: string): Point {
    const [x, y] = str.split(',').map(val => parseInt(val, 10));
    return { x, y }
}

function findExitStepCount(map: Map, blizzards: Blizzard[], personPoints: Point[]): number {
    // Find next blizzard locations
    for (const blizzard of blizzards) {
        blizzard.location = getNextBizzardPoint(map, blizzard);
    }

    const nextPersonPoints: Set<string> = new Set();

    for (const person of personPoints) {
        if (person.x === map[map.length - 1].length - 2 && person.y === map.length - 1) {
            return 0;
        }

        const toAdd = getNextPersonPoints(map, blizzards, person);
        for (const add of toAdd) {
            nextPersonPoints.add(pointToString(add));
        }
    }

    return 1 + findExitStepCount(map, blizzards, Array.from(nextPersonPoints).map(stringToPoint));

    // Find next potential person locations
}


function findExitStepCount2(map: Map, blizzards: Blizzard[], personPoints: Point[], checkPoints: Point[]): number {
    // Find next blizzard locations
    for (const blizzard of blizzards) {
        blizzard.location = getNextBizzardPoint(map, blizzard);
    }

    const nextPersonPoints: Set<string> = new Set();

    for (const person of personPoints) {
        if (isEqualPoint(person, checkPoints[0])) {
            const [first, ...rest] = checkPoints;
            if (rest.length === 0) {
                return 0;
            } else {
                return 1 + findExitStepCount2(map, blizzards, [first], rest);
            }
        }

        const toAdd = getNextPersonPoints(map, blizzards, person);
        for (const add of toAdd) {
            nextPersonPoints.add(pointToString(add));
        }
    }

    return 1 + findExitStepCount2(map, blizzards, Array.from(nextPersonPoints).map(stringToPoint), checkPoints);

    // Find next potential person locations
}

//console.log(findExitStepCount(puzzle, blizzards, [{ x: 1, y: 0 }]))
console.log(findExitStepCount2(puzzle, blizzards, [{ x: 1, y: 0 }],
    [
        { x: puzzle[puzzle.length - 1].length - 2, y: puzzle.length - 1 },
        { x: 1, y: 0 },
        { x: puzzle[puzzle.length - 1].length - 2, y: puzzle.length - 1 }
    ]))