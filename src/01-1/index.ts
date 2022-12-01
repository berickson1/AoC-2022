import input from './input';

let topElves = 3;

let calorieCounts: number[] = [];
let currentCalories = 0;
for (const inputLine of input.split('\n')) {
    if (inputLine === '') {
        calorieCounts.push(currentCalories)
        currentCalories = 0;
        continue;
    }

    const parsedCalories = parseInt(inputLine, 10);
    currentCalories += parsedCalories
}

console.log(calorieCounts.sort((a, b) => a-b).reverse().splice(0, topElves).reduce((prev, curr) => prev + curr))