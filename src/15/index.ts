import { puzzleInput as input } from './input';
//import input from './input';

enum Contents {
    Sensor,
    Beacon,
    NoBeacon
}

type Point = [number, number];

type MapState = Map<number, Map<number, Contents>> // Rows (y) of Cols (x)

const parserRegex = /Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/

function getRow(map: MapState, y: number): Map<number, Contents> {
    let row = map.get(y);
    if (!row) {
        row = new Map();
        map.set(y, row);
    }
    return row;
}

function getMissingMapPoint(map: Map<number, number>, maxCoord: number): number {

    const keys = Array.from(map.keys()).sort((a, b) => a - b);
    let currMax = -1;
    for (const key of keys) {
        if (currMax + 1 < key) {
            return currMax + 1;
        }
        const potentialMax = key + map.get(key)!;
        if (potentialMax > currMax) {
            currMax = potentialMax;
        }
    }

    return -1;

}

function findMissing(map: MapState, pairs: { sensor: Point, beacon: Point }[], maxCoord: number): [Set<number>, number] {
    for (let y = 0; y < maxCoord; y++) {
        const map = new Map<number, number>()
        for (const pair of pairs) {
            const distance = Math.abs(pair.sensor[0] - pair.beacon[0]) + Math.abs(pair.sensor[1] - pair.beacon[1]);
            const yDistanceToTarget = Math.abs(y - pair.sensor[1])
            const xStart = Math.max(0, pair.sensor[0] - distance + yDistanceToTarget)
            const xEnd = Math.min(pair.sensor[0] + distance - yDistanceToTarget, maxCoord)
            if (xStart <= xEnd) {
                let len = xEnd - xStart;
                const maybeMapPoint = map.get(xStart)
                if (maybeMapPoint) {
                    len = Math.max(len, maybeMapPoint)
                }
                map.set(xStart, len);
            }
        }
        const missingPoint = getMissingMapPoint(map, maxCoord);
        if (missingPoint !== -1) {
            console.log(missingPoint, y)
        }
    }
    throw new Error();
}

function fillInForRow(map: MapState, pairs: { sensor: Point, beacon: Point }[], targetRow: number): void {
    const row = getRow(map, targetRow);
    for (const pair of pairs) {
        const distance = Math.abs(pair.sensor[0] - pair.beacon[0]) + Math.abs(pair.sensor[1] - pair.beacon[1]);
        // known distance to row
        const yDistanceToTarget = targetRow - pair.sensor[1];
        if (Math.abs(yDistanceToTarget) <= distance) {
            const xRange = distance - Math.abs(yDistanceToTarget);
            for (let x = pair.sensor[0] - xRange; x <= pair.sensor[0] + xRange; x++) {
                if (row.get(x) === undefined) {
                    row.set(x, Contents.NoBeacon);
                }
            }
        }

        // Iterate in negative x
    }
}

function makeRow(map: MapState, pairs: { sensor: Point, beacon: Point }[], targetRow: number, maxCoord: number): number {
    const row = getRow(map, targetRow);
    let count = row.size;
    for (const pair of pairs) {
        const distance = Math.abs(pair.sensor[0] - pair.beacon[0]) + Math.abs(pair.sensor[1] - pair.beacon[1]);
        // known distance to row
        const yDistanceToTarget = targetRow - pair.sensor[1];
        if (Math.abs(yDistanceToTarget) <= distance) {
            const xRange = distance - Math.abs(yDistanceToTarget);
            for (let x = Math.max(0, pair.sensor[0] - xRange); x <= Math.min(pair.sensor[0] + xRange, maxCoord); x++) {
                if (row.get(x) === undefined) {
                    count++
                }
            }
        }
    }

    return count;
}

function createMap(input: string, checkRow: number): { map: MapState, pairs: { sensor: Point, beacon: Point }[] } {
    const map: MapState = new Map();
    const pairs: { sensor: Point, beacon: Point }[] = [];

    for (const mapData of input.split('\n')) {
        const [_, sensorX, sensorY, beaconX, beaconY] = parserRegex.exec(mapData)!.map(val => parseInt(val, 10));
        pairs.push({ sensor: [sensorX, sensorY], beacon: [beaconX, beaconY] });
        getRow(map, sensorY).set(sensorX, Contents.Sensor);
        getRow(map, beaconY).set(beaconX, Contents.Beacon);
    }

    //fillInMap(map, pairs);
    fillInForRow(map, pairs, checkRow)

    return {
        map,
        pairs
    };
}

function createMap2(input: string, maxCoord: number): { map: MapState, pairs: { sensor: Point, beacon: Point }[] } {
    const map: MapState = new Map();
    const pairs: { sensor: Point, beacon: Point }[] = [];

    for (const mapData of input.split('\n')) {
        const [_, sensorX, sensorY, beaconX, beaconY] = parserRegex.exec(mapData)!.map(val => parseInt(val, 10));
        pairs.push({ sensor: [sensorX, sensorY], beacon: [beaconX, beaconY] });
        getRow(map, sensorY).set(sensorX, Contents.Sensor);
        getRow(map, beaconY).set(beaconX, Contents.Beacon);
    }

    const [rowData, foundY] = findMissing(map, pairs, maxCoord);
    const numbers = Array.from(rowData).sort((a, b) => { return a - b })
    for (let i = 0; i < maxCoord; i++) {
        if (numbers[i] !== i) {
            console.log(`x: ${i} y: ${foundY}`)
            break;
        }

    }

    return {
        map,
        pairs
    };
}

// {
//     const data = createMap(input, 2000000);

//     let count = 0;

//     for (const [_, contents] of data.map.get(2000000)!) {
//         if (contents === Contents.NoBeacon) {
//             count++;
//         }

//     }

//     console.log(count)
// }

{
    const maxCoord = 4000000;
    const data = createMap2(input, maxCoord);
}
