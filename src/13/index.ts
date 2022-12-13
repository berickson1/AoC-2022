import { puzzleInput as input } from './input';
//import input from './input';

type PacketData = (number | PacketData)[];
interface PacketTuple {
    left: PacketData,
    right: PacketData
}

function parseInput(input: string): PacketTuple[] {
    const result: PacketTuple[] = [];

    for (const tuple of input.split('\n\n')) {
        const [leftInput, rightInput] = tuple.split('\n');
        result.push({
            left: JSON.parse(leftInput),
            right: JSON.parse(rightInput)
        });
    }

    return result;
}

function parseInput2(input: string): PacketData[] {
    const result: PacketData[] = [];

    for (const packetData of input.split('\n')) {
        if (packetData === '') {
            continue;
        }
        result.push(JSON.parse(packetData));
    }

    return result;
}

function isOrdered(tuple: PacketTuple): number {
    for (let i = 0; i < tuple.left.length && i < tuple.right.length; i++) {
        const left = tuple.left[i];
        const right = tuple.right[i];

        if (typeof left === 'number' && typeof right === 'number') {
            if (left < right) {
                return -1;
            } else if (left > right) {
                return 1;
            }
        } else {
            const ordered = isOrdered({
                left: Array.isArray(left) ? left : [left],
                right: Array.isArray(right) ? right : [right]
            })
            if (ordered !== 0) {
                return ordered;
            }
        }

    }
    if (tuple.left.length > tuple.right.length) {
        return 1;
    }
    if (tuple.left.length < tuple.right.length) {
        return -1;
    }
    return 0;
}
{
    const packets = parseInput(input);

    let i = 1;
    let sum = 0;
    for (const packet of packets) {
        if (isOrdered(packet) === -1) {
            sum += i;
        }
        i++;
    }

    console.log(sum)
}

{
    const dividerPackets: PacketData[] = [[[2]], [[6]]];
    const packets = parseInput2(input).concat(dividerPackets);
    packets.sort((left, right) => isOrdered({ left, right }));
    console.log((packets.indexOf(dividerPackets[0]) + 1) * (packets.indexOf(dividerPackets[1]) + 1))
}