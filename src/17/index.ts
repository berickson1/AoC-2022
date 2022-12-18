import { puzzleInput as input } from './input';
//import input from './input';

const rocksRaw = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`

const rocks = rocksRaw.split('\n\n').map(val => val.split('\n').map(row => row.split('').map(char => char === '.' ? false : true)))


enum Direction {
    Left,
    Right,
    Down
}

class Map {
    private _top = -1;
    private _rows: boolean[][] = [];
    private _moveId = 0;
    private _nextRockId = 0;
    private _movingRock = Rock.next(this, this._nextRockId++);

    constructor(private _width: number, private _movePattern: string) {

    }

    private _printMap(): void {
        console.clear();
        for (let y = this._rows.length - 1; y >= 0; y--) {
            console.log(this._rows[y].map(val => val ? '#' : '.'))
        }
    }

    public width(): number {
        return this._width;
    }

    public height(): number {
        return this._top;
    }

    public rockEntryPointY(): number {
        return this._top + 4;
    }

    public isOpen(x: number, y: number): boolean {
        if (x > this._width - 1 || x < 0) {
            return false;
        }

        if (y < 0) {
            return false;
        }

        if (!this._rows[y]) {
            return true;
        }
        return !this._rows[y][x]
    }

    private _getNextMove(): Direction {
        const char = this._movePattern[this._moveId % this._movePattern.length];
        this._moveId++;
        switch (char) {
            case '<':
                return Direction.Left
            case '>':
                return Direction.Right
        }
        throw new Error();
    }

    public tick(): void {
        // move
        const moveDirection = this._getNextMove();
        this._movingRock.move(moveDirection);

        // fall
        const success = this._movingRock.move(Direction.Down);
        if (!success) {
            this._solidify();
        }
    }

    private _solidify(): void {
        const solidCoords = this._movingRock.getCoords();
        let newYOffset = 0;
        for (const coord of solidCoords) {
            let row = this._rows[coord[1]]
            if (!row) {
                row = new Array(this._width).fill(false);
                this._rows[coord[1]] = row;
            }
            row[coord[0]] = true;
            if (row.indexOf(false) === -1) {
                newYOffset = coord[1];
            }
        }

        // Recompute top
        for (let y = this._rows.length - 1; y >= 0; y--) {
            if (this._rows[y].includes(true)) {
                this._top = + y;
                break;
            }

        }
        this._movingRock = Rock.next(this, this._nextRockId++);
    }

    public rockCount(): number {
        return this._nextRockId;
    }

    private _rowEqual(i1: number, i2: number): boolean {
        for (let i = 0; i < this._rows[i1].length; i++) {
            if (this._rows[i1][i] !== this._rows[i2][i]) {
                return false;
            }
        }
        return true;
    }

    public findPattern(start: number, expectedPatternLength: number | undefined = undefined): [start: number, count: number] | undefined {
        let firstI = start;
        let secondI = start + (!expectedPatternLength ? 10 : expectedPatternLength);
        let checkOffset = 0

        do {
            if (!this._rowEqual(firstI, secondI)) {
                if (expectedPatternLength) {
                    return undefined;
                }
                secondI++
                checkOffset = 0;
                continue;
            }
            do {
                checkOffset++
                if (!this._rowEqual(firstI + checkOffset, secondI + checkOffset)) {
                    checkOffset = 0;
                    secondI++;
                    break;
                }
                if (firstI + checkOffset === secondI) {
                    let earlierPattern = this.findPattern(start - 1, checkOffset);
                    if (earlierPattern) {
                        return earlierPattern
                    }
                    return [firstI, checkOffset];
                }
            } while ((checkOffset < secondI - firstI))

        } while (true)

        return undefined;
    }
}

class Rock {
    public static next(map: Map, rockId: number): Rock {
        const bitMask = rocks[rockId % 5];
        return new Rock(map, bitMask, 2, map.rockEntryPointY());
    }
    private constructor(private _map: Map, private _mask: boolean[][], public x: number, public y = 0) {

    }

    private _canMove(direction: Direction): boolean {
        let deltaY = 0;
        let deltaX = 0;
        if (direction === Direction.Down) {
            deltaY = -1
            if (this.y === 0) {
                return false;
            }
        } else if (direction === Direction.Right) {
            deltaX = 1;
        } else if (direction === Direction.Left) {
            deltaX = -1;
        }
        for (let y = 0; y < this._mask.length; y++) {
            const xMask = this._mask[y];
            for (let x = 0; x < xMask.length; x++) {
                const element = xMask[x];
                // Only check if we have rock in the mask
                if (element) {
                    const open = this._map.isOpen(this.x + x + deltaX, this.y + this._mask.length - 1 - y + deltaY);
                    if (!open) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    move(direction: Direction): boolean {
        if (!this._canMove(direction)) {
            return false;
        }
        if (direction === Direction.Down) {
            this.y -= 1
        } else if (direction === Direction.Right) {
            this.x += 1;
        } else if (direction === Direction.Left) {
            this.x -= 1;
        }
        return true;
    }

    getCoords(): [number, number][] {
        const results: [number, number][] = []
        for (let y = 0; y < this._mask.length; y++) {
            const xMask = this._mask[y];
            for (let x = 0; x < xMask.length; x++) {
                const element = xMask[x];
                // Only mark if we have rock in the mask
                if (element) {
                    results.push([this.x + x, this.y + this._mask.length - 1 - y]);
                }
            }
        }

        return results

    }
}

function findPattern(map: Map) {
    return map.findPattern(1000)
}


{
    const map = new Map(7, input)
    while (map.rockCount() < 2022) {
        map.tick();
    }
    console.log(map.height() + 4)
}

{
    const map = new Map(7, input)
    while (map.rockCount() <= 100000) {
        map.tick();
    }
    let [patternStartHeight, patternHeight] = findPattern(map)!;

    const map2 = new Map(7, input)
    let firstPatterRockIndex = 0;
    let secondPatternRockIndex = 0;
    while (map2.rockCount() <= 100000) {
        map2.tick();
        if (map2.height() >= patternStartHeight && !firstPatterRockIndex) {
            firstPatterRockIndex = map2.rockCount() - 1;
            patternStartHeight = map2.height();
        }
        if (map2.height() >= patternStartHeight + patternHeight && !secondPatternRockIndex) {
            secondPatternRockIndex = map2.rockCount() - 1;
        }
    }

    const map3 = new Map(7, input)
    const indexRecurrence = (secondPatternRockIndex - firstPatterRockIndex);
    // Drop rocks until beginning of the pattern
    while (map3.rockCount() < firstPatterRockIndex + indexRecurrence - 1) {
        map3.tick();
    }
    const targetRocks = 1000000000000;
    const recurringRows = Math.floor((targetRocks - map3.rockCount()) / indexRecurrence);
    const reucurringHeightCount = recurringRows * patternHeight;
    while (map3.rockCount() + recurringRows * indexRecurrence <= targetRocks) {
        map3.tick();
    }

    console.log('part 2:', map3.height() + reucurringHeightCount + 1);

}