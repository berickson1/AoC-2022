import { puzzleInput as input } from './input';
//import input from './input';

const SNAFUBASE = 5;

function snafuToDecimal(input: string): number {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        const element = input[i];
        let modifier = NaN;
        switch (element) {
            case '2':
                modifier = 2;
                break;
            case '1':
                modifier = 1;
                break;
            case '0':
                modifier = 0
                break;
            case '-':
                modifier = -1
                break;
            case '=':
                modifier = -2
                break;
        }
        sum += (Math.pow(SNAFUBASE, input.length - 1 - i)) * modifier
    }
    return sum;
}

function decimalToSnafu(input: number): string {
    let baseSnafuInput = input.toString(SNAFUBASE);
    let carry = 0;
    // Modify snafubase
    for (let i = baseSnafuInput.length - 1; i >= 0; i--) {
        let newElement: string;
        const element = parseInt(baseSnafuInput[i], 10) + carry;
        carry = 0;
        switch (element) {
            case 9:
                carry = 2;
                newElement = '-'
                break;
            case 8:
                carry = 2;
                newElement = '='
                break;
            case 7:
                carry = 1;
                newElement = '2';
                break;
            case 6:
                carry = 1;
                newElement = '1';
                break;
            case 5:
                carry = 1;
                newElement = '0'
                break;
            case 4:
                carry = 1;
                newElement = '-'
                break;
            case 3:
                carry = 1;
                newElement = '='
                break;
            case 2:
                newElement = '2';
                break;
            case 1:
                newElement = '1';
                break;
            case 0:
                newElement = '0'
                break;
            default:
                throw new Error()

        }
        baseSnafuInput = baseSnafuInput.substring(0, i) + newElement + baseSnafuInput.substring(i + 1);
    }
    while (carry) {
        let newElement: string
        switch (carry) {
            case 9:
                carry = 2;
                newElement = '-'
                break;
            case 8:
                carry = 2;
                newElement = '='
                break;
            case 7:
                carry = 1;
                newElement = '2';
                break;
            case 6:
                carry = 1;
                newElement = '1';
                break;
            case 5:
                carry = 1;
                newElement = '0'
                break;
            case 4:
                carry = 1;
                newElement = '-'
                break;
            case 3:
                carry = 1;
                newElement = '='
                break;
            case 2:
                carry = 0
                newElement = '2';
                break;
            case 1:
                carry = 0
                newElement = '1';
                break;
            case 0:
                carry = 0
                newElement = '0'
                break;
            default:
                throw new Error()

        }
        baseSnafuInput = newElement + baseSnafuInput
    }
    return baseSnafuInput;

}

let sum = 0;
for (const val of input.split('\n')) {
    sum += snafuToDecimal(val);
}
console.log(decimalToSnafu(sum))
