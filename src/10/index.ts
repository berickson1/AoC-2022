import { puzzleInput as input } from './input';
//import input from './input';

interface OperationInfo {
    name: string;
    cycles: number;
}

interface PayloadInfo extends OperationInfo {
    payloadData?: number
}

const operationInfo: OperationInfo[] = [
    {
        name: 'noop',
        cycles: 1
    },
    {
        name: 'addx',
        cycles: 2,
    }
];

function operationToClockCycles(opName: string): number {
    if (opName === 'noop') {
        return 1
    }
    return 2;
}

function parseInstructions(input: string): PayloadInfo[] {
    return input.split('\n').map(line => {
        const opName = line.substring(0, 4);
        const payloadData = parseInt(line.substring(5), 10)
        return {
            name: opName,
            cycles: operationToClockCycles(opName),
            payloadData
        }
    })
}

function runProgram1(instructions: PayloadInfo[], reportAt: number[]): number[] {
    const result: number[] = [];
    let registerVal = 1;
    let currentCycle = 0;
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        for (let j = 0; j < instruction.cycles; j++) {
            currentCycle++
            if (reportAt.includes(currentCycle)) {
                result.push(registerVal * currentCycle);
            }
        }
        if (instruction.name === 'addx') {
            registerVal += instruction.payloadData ?? 0;
        }
    }
    return result;
}

function runProgram2(instructions: PayloadInfo[]): string[] {
    const result: string[] = new Array(40 * 6).fill('.');
    let spriteCenter = 1;
    let currentCycle = 0;
    let currentCol = 0;
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        for (let j = 0; j < instruction.cycles; j++) {
            if (spriteCenter - 1 <= currentCol && spriteCenter + 1 >= currentCol) {
                result[currentCycle] = '#'
            }
            currentCol++;
            currentCycle++
            if (currentCol >= 40) {
                currentCol = 0;
            }
        }
        if (instruction.name === 'addx') {
            spriteCenter += instruction.payloadData ?? 0;
        }
    }
    return result;
}

function printOutput(pixels: string[]): void {
    for (let i = 0; i < 6; i++) {
        const row: string[] = [];
        for (let j = 0; j < 40; j++) {
            row.push(pixels[(i * 40) + j]);
        }
        console.log(row.join(''));

    }
}

const instructions = parseInstructions(input);

{
    const reportAt = [20];
    for (let i = 0; i < 200; i++) {
        reportAt.push(reportAt[reportAt.length - 1] + 40)
    }
    const result = runProgram1(instructions, reportAt);
    console.log(`part 1: ${result.reduce((prev, curr) => prev + curr)}`);
}

{
    console.log(`part 2`);
    printOutput(runProgram2(instructions));
}