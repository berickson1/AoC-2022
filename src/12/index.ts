import { puzzleInput as input } from './input';
//import input from './input';

interface Node {
    x: number,
    y: number,
    altitude: number,
}

interface NodeTree {
    node: Node,
    neighbours: NodeTree[],
}

function parseInput(input: string): { nodes: Node[][], start: Node, end: Node } {
    const result: Node[][] = [];
    let start!: Node;
    let end!: Node;
    for (let y = 0; y < input.split('\n').length; y++) {
        const rowResult: Node[] = [];
        const row = input.split('\n')[y];
        for (let x = 0; x < row.split('').length; x++) {
            const height = row.split('')[x];
            if (height === 'S') {
                const node = { x, y, altitude: 0 }
                rowResult.push(node);
                start = node;
            } else if (height === 'E') {
                const node = { x, y, altitude: 25 }
                rowResult.push(node);
                end = node;
            } else {
                rowResult.push({ x, y, altitude: height.charCodeAt(0) - 'a'.charCodeAt(0) })
            }
        }
        result.push(rowResult)

    }
    return { nodes: result, start, end };
}

function buildNodeTree(nodes: Node[][], startNode: Node, trackedNodes: Map<Node, NodeTree>): NodeTree {
    if (trackedNodes.has(startNode)) {
        return trackedNodes.get(startNode)!
    }
    const tree: NodeTree = { node: startNode, neighbours: [] };
    trackedNodes.set(startNode, tree);
    const neighbours: Node[] = [];
    // Check nodes in all directions
    if (startNode.x > 0) {
        neighbours.push(nodes[startNode.y][startNode.x - 1]);
    }
    if (startNode.x < nodes[startNode.y].length - 1) {
        neighbours.push(nodes[startNode.y][startNode.x + 1]);
    }
    if (startNode.y > 0) {
        neighbours.push(nodes[startNode.y - 1][startNode.x]);
    }
    if (startNode.y < nodes.length - 1) {
        neighbours.push(nodes[startNode.y + 1][startNode.x]);
    }
    const forwardNeighbours = neighbours.filter(val => {
        return val.altitude - startNode.altitude <= 1
    }).map(node => {
        return buildNodeTree(nodes, node, trackedNodes)
    });
    tree.neighbours.push(...forwardNeighbours);
    return tree;
}

function findShortestPath(nodeTree: NodeTree, start: Node, end: Node): number {
    // BFS
    const visited: Set<Node> = new Set();
    let currVisitSet: Set<NodeTree> = new Set();;
    let nextVisitSet: Set<NodeTree> = new Set([...nodeTree.neighbours]);
    visited.add(start);
    let len = 1;

    do {
        len++;
        currVisitSet = nextVisitSet;
        nextVisitSet = new Set();
        for (const currTree of currVisitSet) {
            visited.add(currTree!.node);
            for (const nextTree of currTree!.neighbours) {
                if (!visited.has(nextTree.node)) {
                    nextVisitSet.add(nextTree)
                    if (nextTree.node === end) {
                        return len;
                    }
                }
            }
        }
    } while (nextVisitSet.size > 0)

    return -1;
}
const instructions = parseInput(input);
const trackedNodes: Map<Node, NodeTree> = new Map();
const tree = buildNodeTree(instructions.nodes, instructions.start, trackedNodes);


{
    console.log(findShortestPath(tree, instructions.start, instructions.end))
}

{
    let shortest = Number.MAX_VALUE;
    for (const node of trackedNodes) {
        if (node[0].altitude === 0) {
            const len = findShortestPath(node[1], node[0], instructions.end);
            if (len !== -1 && len < shortest) {
                shortest = len;
            }
        }
    }
    console.log(shortest)
}