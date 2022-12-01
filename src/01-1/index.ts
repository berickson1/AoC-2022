import input from './input';

let maxCalories = 0;

let currentCalories = 0;
for (const inputLine of input.split('\n')) {
    if (inputLine === '') {
        if (currentCalories > maxCalories) {
            maxCalories = currentCalories;
        }
        currentCalories = 0;
        continue;
    }

    const parsedCalories = parseInt(inputLine, 10);
    currentCalories += parsedCalories
}

console.log(maxCalories)