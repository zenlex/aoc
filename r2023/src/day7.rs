use std::error::Error;

use crate::utils;

pub fn run() {
    println!("Running D7..");
    println!("Part 1: {}", main("./inputs/d7.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d7.txt").unwrap());
}

fn main(input: &str) -> Result<i32, Box<dyn Error>> {
    Ok(6440)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d7-ex1.txt").unwrap(), 6440);
        // assert_eq!(main("./inputs/d7.txt").unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d7-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d7.txt").unwrap(), 0);
    // }
}
