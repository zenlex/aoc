export default
  `Monkey 0:
  Starting items: 93, 54, 69, 66, 71
  Operation: new = old * 3
  Test: divisible by 7
    If true: throw to monkey 7
    If false: throw to monkey 1

Monkey 1:
  Starting items: 89, 51, 80, 66
  Operation: new = old * 17
  Test: divisible by 19
    If true: throw to monkey 5
    If false: throw to monkey 7

Monkey 2:
  Starting items: 90, 92, 63, 91, 96, 63, 64
  Operation: new = old + 1
  Test: divisible by 13
    If true: throw to monkey 4
    If false: throw to monkey 3

Monkey 3:
  Starting items: 65, 77
  Operation: new = old + 2
  Test: divisible by 3
    If true: throw to monkey 4
    If false: throw to monkey 6

Monkey 4:
  Starting items: 76, 68, 94
  Operation: new = old * old
  Test: divisible by 2
    If true: throw to monkey 0
    If false: throw to monkey 6

Monkey 5:
  Starting items: 86, 65, 66, 97, 73, 83
  Operation: new = old + 8
  Test: divisible by 11
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 6:
  Starting items: 78
  Operation: new = old + 6
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1

Monkey 7:
  Starting items: 89, 57, 59, 61, 87, 55, 55, 88
  Operation: new = old + 7
  Test: divisible by 5
    If true: throw to monkey 2
    If false: throw to monkey 5`
