import { puzzleInput as input } from './input';
//import input from './input';

interface Point {
    x: number,
    y: number,
    z: number,
}

type MapRepresentation = Map<string, Point & { neighbours: Set<Point> }>;

const points: Point[] = input.split('\n').map(val => {
    const components = val.split(',').map(s => parseInt(s, 10))
    return {
        x: components[0],
        y: components[1],
        z: components[2],
    }
});

function buildKey(x: number, y: number, z: number): string {
    return `${x},${y},${z}`;
}

const map: MapRepresentation = new Map()
for (const point of points) {
    map.set(buildKey(point.x, point.y, point.z), {
        ...point,
        neighbours: new Set()
    })
}

for (const [key, point] of map) {
    // x-axis
    {
        const negkey = buildKey(point.x - 1, point.y, point.z);
        const posKey = buildKey(point.x + 1, point.y, point.z);

        if (map.has(negkey)) {
            const neighbour = map.get(negkey)!
            point.neighbours.add(neighbour);
            neighbour.neighbours.add(point);
        }
        if (map.has(posKey)) {
            const neighbour = map.get(posKey)!
            point.neighbours.add(neighbour);
            neighbour.neighbours.add(point);
        }
    }

    // y-axis
    {
        const negkey = buildKey(point.x, point.y - 1, point.z);
        const posKey = buildKey(point.x, point.y + 1, point.z);

        if (map.has(negkey)) {
            const neighbour = map.get(negkey)!
            point.neighbours.add(neighbour);
            neighbour.neighbours.add(point);
        }
        if (map.has(posKey)) {
            const neighbour = map.get(posKey)!
            point.neighbours.add(neighbour);
            neighbour.neighbours.add(point);
        }
    }

    // z-axis
    {
        const negkey = buildKey(point.x, point.y, point.z - 1);
        const posKey = buildKey(point.x, point.y, point.z + 1);

        if (map.has(negkey)) {
            const neighbour = map.get(negkey)!
            point.neighbours.add(neighbour);
            neighbour.neighbours.add(point);
        }
        if (map.has(posKey)) {
            const neighbour = map.get(posKey)!
            point.neighbours.add(neighbour);
            neighbour.neighbours.add(point);
        }
    }
}

function getSurfaceArea(map: MapRepresentation): number {
    let sum = 0
    for (const [_, point] of map) {
        sum += 6 - point.neighbours.size
    }
    return sum
}

enum State {
    Unknown,
    Rock,
    Outside,
    Inside
}

function getExteriorSurfaceArea(map: MapRepresentation): number {
    const stateMap = new Map<string, State>()
    let xLower = -1;
    let yLower = -1;
    let zLower = -1;
    let xUpper = 0;
    let yUpper = 0;
    let zUpper = 0;
    for (const [_, point] of map) {
        xUpper = Math.max(xUpper, point.x)
        yUpper = Math.max(yUpper, point.y)
        zUpper = Math.max(zUpper, point.z)
    }
    xUpper++;
    yUpper++;
    zUpper++;
    for (let x = xLower; x <= xUpper; x++) {
        for (let y = yLower; y <= yUpper; y++) {
            for (let z = zLower; z <= zUpper; z++) {
                const checkKey = buildKey(x, y, z);
                if (map.has(checkKey)) {
                    stateMap.set(checkKey, State.Rock)
                } else {
                    stateMap.set(checkKey, State.Unknown)
                }
            }
        }
    }
    // Traverse again to mark all outsides
    let nextNeighbours = markNeighbours(map, stateMap, 0, 0, 0, State.Outside);
    let upcomingNeighbours = [];
    do {
        for (const neighbour of nextNeighbours) {
            upcomingNeighbours.push(...markNeighbours(map, stateMap, ...neighbour, State.Outside))
        }
        nextNeighbours = upcomingNeighbours;
        upcomingNeighbours = [];
    } while (nextNeighbours.length > 0)

    // Count all the things
    let sum = 0;
    for (let x = xLower; x <= xUpper; x++) {
        for (let y = yLower; y <= yUpper; y++) {
            for (let z = zLower; z <= zUpper; z++) {
                const nodeKey = buildKey(x, y, z);
                if (!stateMap.has(nodeKey)) {
                    continue;
                }
                const node = stateMap.get(nodeKey);
                if (node !== State.Outside) {
                    continue;
                }
                // check all 4 sides
                sum += countNeighbours(map, stateMap, x, y, z, State.Rock)

            }
        }
    }
    return sum
}

function markNeighbours(map: MapRepresentation, stateMap: Map<string, State>, startX: number, startY: number, startZ: number, type: State): [number, number, number][] {
    const nextNeighbours: [number, number, number][] = [];
    // x-axis
    {
        const negkey = buildKey(startX - 1, startY, startZ);
        const posKey = buildKey(startX + 1, startY, startZ);

        if (stateMap.has(negkey) && stateMap.get(negkey)! === State.Unknown) {
            stateMap.set(negkey, type);
            nextNeighbours.push([startX - 1, startY, startZ]);
        }
        if (stateMap.has(posKey) && stateMap.get(posKey)! === State.Unknown) {
            stateMap.set(posKey, type);
            nextNeighbours.push([startX + 1, startY, startZ]);
        }
    }

    // y-axis
    {
        const negkey = buildKey(startX, startY - 1, startZ);
        const posKey = buildKey(startX, startY + 1, startZ);

        if (stateMap.has(negkey) && stateMap.get(negkey)! === State.Unknown) {
            stateMap.set(negkey, type);
            nextNeighbours.push([startX, startY - 1, startZ]);
        }
        if (stateMap.has(posKey) && stateMap.get(posKey)! === State.Unknown) {
            stateMap.set(posKey, type);
            nextNeighbours.push([startX, startY + 1, startZ]);
        }
    }

    // z-axis
    {
        const negkey = buildKey(startX, startY, startZ - 1);
        const posKey = buildKey(startX, startY, startZ + 1);

        if (stateMap.has(negkey) && stateMap.get(negkey)! === State.Unknown) {
            stateMap.set(negkey, type);
            nextNeighbours.push([startX, startY, startZ - 1]);
        }
        if (stateMap.has(posKey) && stateMap.get(posKey)! === State.Unknown) {
            stateMap.set(posKey, type);
            nextNeighbours.push([startX, startY, startZ + 1]);
        }
    }
    return nextNeighbours;
}


function countNeighbours(map: MapRepresentation, stateMap: Map<string, State>, startX: number, startY: number, startZ: number, withType: State): number {
    let count = 0;
    // x-axis
    {
        const negkey = buildKey(startX - 1, startY, startZ);
        const posKey = buildKey(startX + 1, startY, startZ);

        if (stateMap.has(negkey) && stateMap.get(negkey) === withType) {
            count++;
        }
        if (stateMap.has(posKey) && stateMap.get(posKey) === withType) {
            count++;
        }
    }

    // y-axis
    {
        const negkey = buildKey(startX, startY - 1, startZ);
        const posKey = buildKey(startX, startY + 1, startZ);

        if (stateMap.has(negkey) && stateMap.get(negkey) === withType) {
            count++;
        }
        if (stateMap.has(posKey) && stateMap.get(posKey) === withType) {
            count++;
        }
    }

    // z-axis
    {
        const negkey = buildKey(startX, startY, startZ - 1);
        const posKey = buildKey(startX, startY, startZ + 1);

        if (stateMap.has(negkey) && stateMap.get(negkey) === withType) {
            count++;
        }
        if (stateMap.has(posKey) && stateMap.get(posKey) === withType) {
            count++;
        }
    }
    return count;
}

console.log(getSurfaceArea(map));
console.log(getExteriorSurfaceArea(map));
