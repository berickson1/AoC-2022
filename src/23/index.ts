import { puzzleInput as input } from './input';
//import input from './input';

type Cell = '.' | '#' | undefined;

type PuzzleMap = Cell[][];

interface Point {
    x: number;
    y: number;
}

type Map = Cell[][];

const directions = ['North', 'South', 'West', 'East'] as const;
type Direction = typeof directions[number]
interface Elf {
    id: number,
    location: Point;
}

function nextDirection(direction: Direction): Direction {
    const nextIndex = directions.indexOf(direction) + 1;
    return directions[nextIndex % direction.length]
}

function wantsToMove(map: Map, elf: Elf, startDirection: Direction): Direction | false {
    let direction = startDirection;
    do {
        if (wantToMoveInDirection(map, elf, direction)) {
            return direction
        }
        direction = nextDirection(direction);
    } while (direction !== startDirection)
    return false;
}

function wantToMoveInDirection(map: Map, elf: Elf, direction: Direction): boolean {
    switch (direction) {
        case 'North':
            return map[elf.location.y - 1][elf.location.x] === '.' &&
                map[elf.location.y - 1][elf.location.x - 1] === '.' &&
                map[elf.location.y - 1][elf.location.x + 1] === '.'
        case 'South':
            return map[elf.location.y + 1][elf.location.x] === '.' &&
                map[elf.location.y + 1][elf.location.x - 1] === '.' &&
                map[elf.location.y + 1][elf.location.x + 1] === '.'
        case 'East':
            return map[elf.location.y + 1][elf.location.x + 1] === '.' &&
                map[elf.location.y][elf.location.x + 1] === '.' &&
                map[elf.location.y - 1][elf.location.x + 1] === '.'
        case 'West':
            return map[elf.location.y + 1][elf.location.x - 1] === '.' &&
                map[elf.location.y][elf.location.x - 1] === '.' &&
                map[elf.location.y - 1][elf.location.x - 1] === '.'
    }
    return false;
}

function mightMove(map: Map, elf: Elf): boolean {
    return map[elf.location.y - 1]?.[elf.location.x - 1] === '#' ||
        map[elf.location.y - 1]?.[elf.location.x] === '#' ||
        map[elf.location.y - 1]?.[elf.location.x + 1] === '#' ||
        map[elf.location.y]?.[elf.location.x - 1] === '#' ||
        map[elf.location.y]?.[elf.location.x + 1] === '#' ||
        map[elf.location.y + 1]?.[elf.location.x - 1] === '#' ||
        map[elf.location.y + 1]?.[elf.location.x] === '#' ||
        map[elf.location.y + 1]?.[elf.location.x + 1] === '#';
}

function nextPoint(elf: Elf, direction: Direction): Point {
    switch (direction) {
        case 'North':
            return { x: elf.location.x, y: elf.location.y - 1 }
        case 'South':
            return { x: elf.location.x, y: elf.location.y + 1 }
        case 'East':
            return { x: elf.location.x + 1, y: elf.location.y }
        case 'West':
            return { x: elf.location.x - 1, y: elf.location.y }
    }
}

function update(map: Map, move: [Elf, Direction]): void {
    const elf = move[0];
    const currentPoint = elf.location;
    const newPoint = nextPoint(elf, move[1]);
    map[currentPoint.y][currentPoint.x] = '.';
    map[newPoint.y][newPoint.x] = '#';
    elf.location = newPoint;
}
const padding = 500;
const puzzle: PuzzleMap = input.split('\n').map(val => {
    const rowData: Cell[] = [];
    for (let padI = 0; padI < padding; padI++) {
        rowData.push('.');
    }
    const colVals = val.split('');
    for (let i = 0; i < colVals.length; i++) {
        const colVal = colVals[i];
        rowData.push(colVal as Cell);

    }
    for (let padI = 0; padI < padding; padI++) {
        rowData.push('.');
    }
    return rowData;
})
const mapWidth = puzzle[0].length;

for (let padI = 0; padI < padding; padI++) {
    puzzle.unshift((new Array(mapWidth)).fill('.'))
}

for (let padI = 0; padI < padding; padI++) {
    puzzle.push((new Array(mapWidth)).fill('.'))
}


const elvesBase: Elf[] = [];
let elfId = 0;
for (let y = 0; y < puzzle.length; y++) {
    const row = puzzle[y];
    for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === '#') {
            elvesBase.push({
                location: {
                    x,
                    y
                },
                id: elfId++,
            })
        }

    }
}

function printMap(map: Map): void {
    console.clear();
    for (const row of map) {
        console.log(row.join(''));
    }
}

function getCountInSmallestRectangle(map: Map): number {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = 0;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = 0;

    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell === '#') {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
    }

    let count = 0;
    for (let y = minY; y <= maxY; y++) {
        const row = map[y];
        for (let x = minX; x <= maxX; x++) {
            const cell = row[x];
            if (cell === '.') {
                count++;
            }
        }
    }
    return count;
}

{
    const elves: Elf[] = JSON.parse(JSON.stringify(elvesBase))
    const map: Map = JSON.parse(JSON.stringify(puzzle));
    let testDirection: Direction = directions[0]

    for (let i = 0; i < 10; i++) {
        let potentialMovinElves: [Elf, Direction][] = []
        for (const elf of elves) {
            if (!mightMove(map, elf)) {
                continue;
            }
            const wantToMoveDirection = wantsToMove(map, elf, testDirection);
            if (!wantToMoveDirection) {
                continue;
            }

            potentialMovinElves.push([elf, wantToMoveDirection]);
        }
        // Remove conflicting moves
        potentialMovinElves = potentialMovinElves.filter(([elf, direction]) => {
            const elfPoint = nextPoint(elf, direction)
            return undefined === potentialMovinElves.find(([elf2, direction2]) => {
                const elfPoint2 = nextPoint(elf2, direction2)
                return elf.id !== elf2.id && elfPoint.x === elfPoint2.x && elfPoint.y === elfPoint2.y;
            })
        });

        // Execute moves
        for (const move of potentialMovinElves) {
            update(map, move)
        }

        testDirection = nextDirection(testDirection)
    }
    console.log(getCountInSmallestRectangle(map));
}


{
    const elves: Elf[] = JSON.parse(JSON.stringify(elvesBase))
    const map: Map = JSON.parse(JSON.stringify(puzzle));
    let testDirection: Direction = directions[0]

    for (let i = 0; i < 1000000; i++) {
        let potentialMovinElves: [Elf, Direction][] = []
        for (const elf of elves) {
            if (!mightMove(map, elf)) {
                continue;
            }
            const wantToMoveDirection = wantsToMove(map, elf, testDirection);
            if (!wantToMoveDirection) {
                continue;
            }

            potentialMovinElves.push([elf, wantToMoveDirection]);
        }

        if (potentialMovinElves.length === 0) {
            console.log(i + 1);
            break;
        }


        // Remove conflicting moves
        potentialMovinElves = potentialMovinElves.filter(([elf, direction]) => {
            const elfPoint = nextPoint(elf, direction)
            return undefined === potentialMovinElves.find(([elf2, direction2]) => {
                const elfPoint2 = nextPoint(elf2, direction2)
                return elf.id !== elf2.id && elfPoint.x === elfPoint2.x && elfPoint.y === elfPoint2.y;
            })
        });

        // Execute moves
        for (const move of potentialMovinElves) {
            update(map, move)
        }

        testDirection = nextDirection(testDirection)
    }
}