//import { puzzleInput as input } from './input';
import input from './input';

enum Contents {
    Air,
    Rock,
    Sand
}

type MapState = Map<number, Map<number, Contents>> // Rows (y) of Cols (x)

function createMap(input: string): MapState {
    const result: MapState = new Map();

    for (const rock of input.split('\n')) {
        const rawCoords = rock.split(' -> ');
        let first: number[];
        let second: number[] = rawCoords.shift()!.split(',').map(input => parseInt(input, 10));
        do {
            first = second;
            second = rawCoords.shift()!.split(',').map(input => parseInt(input, 10));
            // Expand y
            if (first[0] === second[0]) {
                const yStart = first[1];
                const yEnd = second[1]

                for (let y = Math.min(yStart, yEnd); y <= Math.max(yStart, yEnd); y++) {
                    let row = result.get(y);
                    if (!row) {
                        row = new Map();
                        result.set(y, row);
                    }
                    row.set(first[0], Contents.Rock);
                }
            }

            // Expand x
            if (first[1] === second[1]) {
                const xStart = first[0];
                const xEnd = second[0];

                let row = result.get(first[1]);
                if (!row) {
                    row = new Map();
                    result.set(first[1], row);
                }
                for (let x = Math.min(xStart, xEnd); x <= Math.max(xStart, xEnd); x++) {
                    row.set(x, Contents.Rock);
                }
            }
        } while (rawCoords.length > 0)

    }

    return result;
}

function getMapBottom(map: MapState): number {
    let max = 0;
    map.forEach((_, key) => {
        if (key > max) {
            max = key
        }
    })
    return max
}

function addSand(map: MapState, addAt: [number, number]): [number, number] {
    const restPoint = findRestPoint(map, addAt, getMapBottom(map));

    let row = map.get(restPoint[1]);
    if (!row) {
        row = new Map();
        map.set(restPoint[1], row)
    }
    row.set(restPoint[0], Contents.Sand);

    return restPoint;
}

function findRestPoint(map: MapState, sand: [number, number], yBottom: number): [number, number] {

    if (sand[1] > yBottom) {
        return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
    }
    // check below
    const belowPoint = map.get(sand[1] + 1)?.get(sand[0]);
    if (belowPoint === undefined || belowPoint === Contents.Air) {
        return findRestPoint(map, [sand[0], sand[1] + 1], yBottom)
    }

    // check below left
    const belowLeftPoint = map.get(sand[1] + 1)?.get(sand[0] - 1);
    if (belowLeftPoint === undefined || belowLeftPoint === Contents.Air) {
        return findRestPoint(map, [sand[0] - 1, sand[1] + 1], yBottom)
    }

    // check below right
    const belowRightPoint = map.get(sand[1] + 1)?.get(sand[0] + 1);
    if (belowRightPoint === undefined || belowRightPoint === Contents.Air) {
        return findRestPoint(map, [sand[0] + 1, sand[1] + 1], yBottom)
    }

    return [sand[0], sand[1]];

}

{
    const map = createMap(input);

    let sandCount = 0;
    let rest: [number, number];
    do {
        sandCount++;
        rest = addSand(map, [500, 0])
    } while (rest[0] !== Number.POSITIVE_INFINITY)

    console.log(sandCount - 1)
}

{
    const map = createMap(input);

    const floor = getMapBottom(map) + 2;
    const rowVal = new Map();
    for (let i = 0; i < 1000000; i++) {
        rowVal.set(i, Contents.Rock);
    }
    map.set(floor, rowVal)

    let sandCount = 0;
    let rest: [number, number];
    do {
        sandCount++;
        rest = addSand(map, [500, 0])
    } while (rest[0] !== 500 || rest[1] !== 0)

    console.log(sandCount)
}
