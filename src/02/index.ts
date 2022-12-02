import input from './input';

const enum Play {
    Rock,
    Paper,
    Scissors
}

const enum Result {
    Lose,
    Draw,
    Win
}

function opponentTokenToPlay(input: string): Play {
    switch (input) {
        case "A":
            return Play.Rock
        case "B":
            return Play.Paper;
        case "C":
            return Play.Scissors
    }
    throw new Error("bad token")
}

function suggestedTokenToPlay(input: string): Play {
    switch (input) {
        case "X":
            return Play.Rock
        case "Y":
            return Play.Paper;
        case "Z":
            return Play.Scissors;
    }
    throw new Error("bad token")
}

function resultTokenToResult(input: string): Result {
    switch (input) {
        case "X":
            return Result.Lose
        case "Y":
            return Result.Draw;
        case "Z":
            return Result.Win;
    }
    throw new Error("bad token")
}

function computePlayFromResultAndOpponent(result: Result, opponentPlay: Play): Play {
    switch (result) {
        case Result.Draw:
            return opponentPlay;
        case Result.Win:
            switch (opponentPlay) {
                case Play.Paper:
                    return Play.Scissors;
                case Play.Rock:
                    return Play.Paper;
                case Play.Scissors:
                    return Play.Rock
            }
            throw new Error("bad token")
        case Result.Lose:
            switch (opponentPlay) {
                case Play.Paper:
                    return Play.Rock;
                case Play.Rock:
                    return Play.Scissors;
                case Play.Scissors:
                    return Play.Paper
            }
            throw new Error("bad token")

    }
    throw new Error("bad token")
}

function parseLine(input: string): { suggestedPlay: Play, opponentPlay: Play } {
    const [opponentToken, suggestedToken] = input.split(' ');
    return {
        opponentPlay: opponentTokenToPlay(opponentToken),
        suggestedPlay: suggestedTokenToPlay(suggestedToken)
    };
}

function parseLinev2(input: string): { suggestedPlay: Play, opponentPlay: Play } {
    const [opponentToken, resultToken] = input.split(' ');
    const result = resultTokenToResult(resultToken);
    const opponentPlay = opponentTokenToPlay(opponentToken);
    return {
        opponentPlay,
        suggestedPlay: computePlayFromResultAndOpponent(result, opponentPlay)
    };
}

function getBaseScore(play: Play): number {
    return play + 1;
}

function computeExpectedStore(opponentPlay: Play, suggestedPlay: Play): number {
    const baseScore = getBaseScore(suggestedPlay);
    if (opponentPlay === suggestedPlay) {
        return baseScore + 3;
    }
    if (suggestedPlay === opponentPlay + 1 || (opponentPlay === Play.Scissors && suggestedPlay === Play.Rock)) {
        return baseScore + 6;
    }
    return baseScore;
}

let sum = 0
for (const line of input.split('\n')) {
    const play = parseLine(line);
    const expectedScore = computeExpectedStore(play.opponentPlay, play.suggestedPlay);
    sum += expectedScore;
}
console.log('1 score:' + sum)

sum = 0
for (const line of input.split('\n')) {
    const play = parseLinev2(line);
    const expectedScore = computeExpectedStore(play.opponentPlay, play.suggestedPlay);
    sum += expectedScore;
}
console.log('2 score:' + sum)