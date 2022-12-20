import { puzzleInput as input } from './input';
//import input from './input';

type RobotType = 'Ore' | 'Clay' | 'Obsidian' | 'Geode'

type Operation = `build${RobotType}` | 'Wait'

type Resource = 'Ore' | 'Clay' | 'Obsidian' | 'Geode'

interface RobotBom {
    type: RobotType;
    cost: { resource: Resource, quantity: number }[];
}

interface Blueprint {
    id: number;
    robots: RobotBom[];
}

type ResourceMap = {
    [k in Resource]: number
}

type RobotMap = {
    [k in RobotType]: number
}

const blueprintParser = /Blueprint (.*): Each ore robot costs (.*). Each clay robot costs (.*). Each obsidian robot costs (.*). Each geode robot costs (.*)./
function resourceNameToResource(input: string): Resource {
    switch (input) {
        case 'ore':
            return 'Ore';
        case 'clay':
            return 'Clay'
        case 'obsidian':
            return 'Obsidian'
        case 'geode':
            return 'Geode'
    }
    throw new Error("Unepxected resource")
}
function computeRobotBom(type: RobotType, input: string): RobotBom {
    const bom: RobotBom = {
        type,
        cost: [],
    }
    const materials = input.split(' and ');
    for (const material of materials) {
        const [cost, resource] = material.split(' ');
        bom.cost.push(
            {
                quantity: parseInt(cost, 10),
                resource: resourceNameToResource(resource),
            }
        )
    }
    return bom;
}

const blueprints = input.split('\n').map(blueprintLine => {
    const [_, blueprintNumber, oreCost, clayCost, obsidianCost, geodeCost] = blueprintParser.exec(blueprintLine)!;
    const blueprint: Blueprint = {
        id: parseInt(blueprintNumber, 10),
        robots: [
            computeRobotBom('Ore', oreCost),
            computeRobotBom('Clay', clayCost),
            computeRobotBom('Obsidian', obsidianCost),
            computeRobotBom('Geode', geodeCost),
        ]
    }
    return blueprint;
})

function calculateMaxCosts(blueprint: Blueprint): ResourceMap {
    const result = {
        Ore: 0,
        Clay: 0,
        Obsidian: 0,
        Geode: 0,
    };
    for (let i = blueprint.robots.length - 1; i >= 0; i--) {
        const robotBom = blueprint.robots[i];
        for (const resource of robotBom.cost) {
            result[resource.resource] = Math.max(result[resource.resource], resource.quantity)
        }
    }
    return result;
}

function getPotentialOperations(blueprint: Blueprint, resourceCounts: ResourceMap, prevOperationQueue: Operation[]): Operation[] {
    const result: Set<Operation> = new Set();
    // See if we can afford anything 
    for (let i = blueprint.robots.length - 1; i >= 0; i--) {
        const robotBom = blueprint.robots[i];
        let canBuild = true;
        for (const resource of robotBom.cost) {
            const currResource = resourceCounts[resource.resource];
            if (currResource < resource.quantity) {
                canBuild = false;
            }
        }
        if (canBuild) {
            result.add(`build${robotBom.type}`);
        }
    }

    // Shortcut, this is always the best operation
    if (result.has('buildGeode')) {
        return ['buildGeode'];
    }
    const canBuildAllRobots = result.size === blueprint.robots.length;
    for (const prevOperation of prevOperationQueue) {
        // If we could have done it last turn, dont do it now
        if (result.has(prevOperation)) {
            result.delete(prevOperation);
        }

    }

    if (!canBuildAllRobots) {
        result.add('Wait');
    }
    return Array.from(result);
}

function addRobot(bom: RobotBom, robotCounts: RobotMap, resourceCounts: ResourceMap) {
    robotCounts[bom.type] = robotCounts[bom.type] + 1;
    for (const resource of bom.cost) {
        resourceCounts[resource.resource] = resourceCounts[resource.resource] - resource.quantity;
    }
}
function unwindRobotAdd(bom: RobotBom, robotCounts: RobotMap, resourceCounts: ResourceMap) {
    robotCounts[bom.type] = robotCounts[bom.type] - 1;
    for (const resource of bom.cost) {
        resourceCounts[resource.resource] = resourceCounts[resource.resource] + resource.quantity;
    }
}



function runSimulation(blueprint: Blueprint, timeLeft: number, robotCounts: RobotMap, resourceCounts: ResourceMap, prevOperationQueue: Operation[], maxCosts: ResourceMap): number {
    let maxGeodes = resourceCounts['Geode'];
    if (timeLeft <= 0) {
        return maxGeodes
    }
    // No geode robots, need t>=2 to build and mine
    if (timeLeft <= 1 && (robotCounts['Geode'] === 0)) {
        return 0
    }

    // Figure out what we can do next
    const potentialOperations = getPotentialOperations(blueprint, resourceCounts, prevOperationQueue).filter(operation => {
        if (operation === 'Wait') {
            return true
        } else {
            const robotBom = blueprint.robots.find(robot => robot.type === operation.slice(5))!
            if (maxCosts[robotBom.type] > 0 && robotCounts[robotBom.type] >= maxCosts[robotBom.type]) {
                return false;
            }
            return true;
        }
    })

    // Robots mine
    for (const [robotKey, count] of Object.entries(robotCounts)) {
        const robot = robotKey as RobotType;
        let resourceCount = resourceCounts[robot];
        resourceCount += count;
        resourceCounts[robot] = resourceCount;
    }

    // Build or wait
    for (const operation of potentialOperations) {
        if (operation === 'Wait') {
            maxGeodes = Math.max(maxGeodes, runSimulation(blueprint, timeLeft - 1, robotCounts, resourceCounts, [...prevOperationQueue, ...potentialOperations], maxCosts));
        } else {
            const robotBom = blueprint.robots.find(robot => robot.type === operation.slice(5))!
            addRobot(robotBom, robotCounts, resourceCounts);
            maxGeodes = Math.max(maxGeodes, runSimulation(blueprint, timeLeft - 1, robotCounts, resourceCounts, [], maxCosts));
            unwindRobotAdd(robotBom, robotCounts, resourceCounts);
        }

    }
    // unwind mining

    // Robots mine
    for (const [robotKey, count] of Object.entries(robotCounts)) {
        const robot = robotKey as RobotType;
        let resourceCount = resourceCounts[robot];
        resourceCount -= count;
        resourceCounts[robot] = resourceCount;
    }
    return maxGeodes;
}



let sum = 0;
for (const blueprint of blueprints) {
    const geodesOpened = runSimulation(blueprint, 24, {
        Ore: 1,
        Clay: 0,
        Obsidian: 0,
        Geode: 0,
    }, {
        Ore: 0,
        Clay: 0,
        Obsidian: 0,
        Geode: 0,
    }, [], calculateMaxCosts(blueprint));
    console.log('blueprint ', blueprint.id, ' opened ', geodesOpened);
    sum += geodesOpened * blueprint.id;
}
console.log('p1 score ', sum)



let product = 1;
for (let i = 0; i < 3; i++) {
    const blueprint = blueprints[i];
    const geodesOpened = runSimulation(blueprint, 32, {
        Ore: 1,
        Clay: 0,
        Obsidian: 0,
        Geode: 0,
    }, {
        Ore: 0,
        Clay: 0,
        Obsidian: 0,
        Geode: 0,
    }, [], calculateMaxCosts(blueprint));
    console.log('blueprint ', blueprint.id, ' opened ', geodesOpened);
    product *= geodesOpened;
}
console.log('p2 score ', product)