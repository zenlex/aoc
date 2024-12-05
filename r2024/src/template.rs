#[allow(unused)]
use aoc_utils::{read_lines, LinesIterator};
use anyhow::Result;

#[allow(dead_code)]
pub fn run() {
    println!("Running D#...");
    println!("Part 1: {}", main("./inputs/d#.txt", 1).unwrap());
    // println!("Part 2: {}", main("./inputs/d#.txt", 2).unwrap());
}

fn main(input: &str, part: u8) -> Result<i32> {
    let lines = read_lines(input)?;
    let result = lines.count() as i32;
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d#-ex1.txt", 1).unwrap(), 0);
        // assert_eq!(main("./inputs/d#.txt", 1).unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d#-ex2.txt", 2).unwrap(), 0);
    //     assert_eq!(main("./inputs/d#.txt", 2).unwrap(), 0);
    // }
}
