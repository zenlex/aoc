#[allow(unused)]
use aoc_utils::{read_lines, LinesIterator};
use anyhow::Result;

pub fn run() {
    println!("Running D#...");
    println!("Part 1: {}", main("./inputs/d#.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d#.txt").unwrap());
}

fn main(input: &str) -> Result<i32> {
    let lines = read_lines(input)?;
    let result = lines.collect().len();
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d#-ex1.txt").unwrap(), 0);
        // assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d#-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    // }
}
