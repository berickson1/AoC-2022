export default `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`

export const puzzleInput = `Monkey 0:
Starting items: 66, 71, 94
Operation: new = old * 5
Test: divisible by 3
  If true: throw to monkey 7
  If false: throw to monkey 4

Monkey 1:
Starting items: 70
Operation: new = old + 6
Test: divisible by 17
  If true: throw to monkey 3
  If false: throw to monkey 0

Monkey 2:
Starting items: 62, 68, 56, 65, 94, 78
Operation: new = old + 5
Test: divisible by 2
  If true: throw to monkey 3
  If false: throw to monkey 1

Monkey 3:
Starting items: 89, 94, 94, 67
Operation: new = old + 2
Test: divisible by 19
  If true: throw to monkey 7
  If false: throw to monkey 0

Monkey 4:
Starting items: 71, 61, 73, 65, 98, 98, 63
Operation: new = old * 7
Test: divisible by 11
  If true: throw to monkey 5
  If false: throw to monkey 6

Monkey 5:
Starting items: 55, 62, 68, 61, 60
Operation: new = old + 7
Test: divisible by 5
  If true: throw to monkey 2
  If false: throw to monkey 1

Monkey 6:
Starting items: 93, 91, 69, 64, 72, 89, 50, 71
Operation: new = old + 1
Test: divisible by 13
  If true: throw to monkey 5
  If false: throw to monkey 2

Monkey 7:
Starting items: 76, 50
Operation: new = old * old
Test: divisible by 7
  If true: throw to monkey 4
  If false: throw to monkey 6`