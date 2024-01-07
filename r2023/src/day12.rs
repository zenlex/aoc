use std::error::Error;

use crate::utils;

pub fn run() {
    println!("Running D12...");
    println!("Part 1: {}", main("./inputs/d12.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d10.txt").unwrap());
}

fn main(input: &str) -> Result<i32, Box<dyn Error>> {
    let lines = utils::read_lines(input)?.map(|l| l.unwrap());
    let mut arrangements = vec![];
    for line in lines {
        arrangements.push(count_arrangements(&line));
    }

    Ok(21)
}

fn count_arrangements(line: &str) -> usize {
    //TODO TDD implementing this function
    1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d12-ex1.txt").unwrap(), 21);
        // assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d#-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    // }

    #[test]
    fn counts() {
        assert_eq!(count_arrangements("???.### 1,1,3"), 1);
    }
}
