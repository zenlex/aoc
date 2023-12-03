#![allow(dead_code)]
use crate::utils;
use std::error::Error;
pub fn run() {
    println!("Running D1...");
    println!("Part 1: {}", main("./inputs/d1.txt", false).unwrap());
    println!("Part 2: {}", main("./inputs/d1.txt", true).unwrap());
}

fn main(input: &str, digitwords: bool) -> Result<i32, Box<dyn Error>> {
    let lines = utils::read_lines(input)?.map(|x| x.unwrap());
    let mut sum = 0;
    for line in lines {
        let mut line = line;
        if digitwords {
            line = replace_digits(&line)
        };
        let mut numbers = line.chars().filter(|x| x.is_numeric());
        let first_digit = numbers.next().unwrap();
        let last_digit = match numbers.last() {
            Some(x) => x,
            None => first_digit,
        };
        let calibration_value = format!("{}{}", first_digit, last_digit).parse::<i32>()?;
        sum += calibration_value;
    }

    Ok(sum)
}

fn replace_digits(input: &str) -> String {
    input
        .replace("one", "o1e")
        .replace("two", "t2o")
        .replace("three", "t3e")
        .replace("four", "f4r")
        .replace("five", "f5e")
        .replace("six", "s6x")
        .replace("seven", "s7n")
        .replace("eight", "e8t")
        .replace("nine", "n9e")
        .replace("zero", "z0o")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::testing::TestResult;

    #[test]
    fn example() -> TestResult {
        assert_eq!(main("./inputs/d1-ex1.txt", false)?, 142);
        assert_eq!(main("./inputs/d1-ex2.txt", true)?, 281);
        assert_eq!(main("./inputs/d1.txt", false)?, 54968);
        assert_eq!(main("./inputs/d1.txt", true)?, 54094);
        Ok(())
    }
}
