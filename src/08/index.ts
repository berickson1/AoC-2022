import { puzzleInput as input } from './input';
//import input from './input';

interface TreeData {
    height: number,
    id: number
}

type TreeHeights = TreeData[][];

function parseInput(input: string): TreeHeights {
    let id = 0;
    return input.split('\n').map(row => row.split('').map(val => { return { height: parseInt(val, 10), id: id++ } }));
}

function getVisibleTreeRow(data: TreeHeights): Set<TreeData> {
    let visibleTrees = new Set<TreeData>
    for (const row of data) {
        // First left to right
        let tallestTree = -1;
        for (const item of row) {
            if (item.height > tallestTree) {
                visibleTrees.add(item)
                tallestTree = item.height;
            }
        }
        // now right to left
        tallestTree = -1;
        for (const item of [...row].reverse()) {
            if (item.height > tallestTree) {
                visibleTrees.add(item)
                tallestTree = item.height;
            }
        }

    }
    return visibleTrees;
}

function rotateData(data: TreeHeights): TreeHeights {
    let result: TreeHeights = [];
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        for (let j = 0; j < element.length; j++) {
            const height = element[j]
            if (i === 0) {
                result.push([height])
            } else {
                result[j].push(height);
            }
        }
    }
    return result;
}

function getVisibleTreeColumns(data: TreeHeights): Set<TreeData> {
    return getVisibleTreeRow(rotateData(data));
}

function countVisibleTrees(data: TreeHeights): number {
    const result = getVisibleTreeRow(data);
    for (const iterator of getVisibleTreeColumns(data)) {
        result.add(iterator);
    }
    return result.size;
}

function getRowVisibleHeights(data: TreeData[], startIndex: number): number[] {
    const result: [number, number] = [0, 0];
    const startHeight = data[startIndex].height;
    for (let i = startIndex + 1; i < data.length; i++) {
        const element = data[i];
        if (element.height < startHeight) {
            result[0]++;
        } else {
            result[0]++;
            break;
        }
    }

    for (let i = startIndex - 1; i >= 0; i--) {
        const element = data[i];
        if (element.height < startHeight) {
            result[1]++;
        } else {
            result[1]++;
            break;
        }
    }
    return result;

}


function getTopScore(data: TreeHeights): number {
    let result = 0;
    const rotatedData = rotateData(data);
    for (let i = 0; i < data.length; i++) {
        const rowData = data[i];
        for (let j = 0; j < rowData.length; j++) {
            const rows = getRowVisibleHeights(rowData, j);
            rows.push(...getRowVisibleHeights(rotatedData[j], i));
            if (rows.length > 0) {
                const finalScore = rows.reduce((prev, curr) => prev * curr)
                if (finalScore > result) {
                    result = finalScore;
                }
            }
        }

    }
    return result
}
const treeData = parseInput(input);

{

    console.log(`part 1: ${countVisibleTrees(treeData)}`);
}

{
    console.log(`part 2: ${getTopScore(treeData)}`);
}