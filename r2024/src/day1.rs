use anyhow::Result;
use aoc_utils::utils;
pub fn run() {
    println!("Running D1...");
    println!("Part 1: {}", main("./inputs/d1.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d1.txt").unwrap());
}

fn main(input: &str) -> Result<i32> {
    todo!("implement logic for day 1")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d10-ex1.txt").unwrap(), 13);
        // assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d#-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    // }
}
