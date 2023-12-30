use std::error::Error;

use crate::utils;

pub fn run() {
    println!("Running D9...");
    println!("Part 1: {}", main("./inputs/d9.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d9.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<i32, Box<dyn Error>> {
    let lines = utils::read_lines(input)?.map(|l| l.unwrap());
    let mut adds = Vec::new();
    for line in lines {
        match part {
            1 => {
                adds.push(get_next_digit(&line));
            }
            2 => {
                adds.push(get_prev_digit(&line));
            }
            _ => {
                panic!("Invalid part");
            }
        }
    }
    Ok(adds.iter().sum())
}

fn get_next_digit(line: &str) -> i32 {
    let og_numbers = parse_numbers(line);

    let mut numbers = og_numbers.clone();
    let mut adds = vec![];
    while numbers.iter().any(|n| *n != 0) {
        numbers = get_diffs(&numbers);
        adds.push(*numbers.iter().last().unwrap());
    }

    og_numbers.iter().last().unwrap() + adds.iter().sum::<i32>()
}

fn get_prev_digit(line: &str) -> i32 {
    let og_numbers = parse_numbers(line);

    let mut numbers = og_numbers.clone();
    let mut leads = vec![];
    while numbers.iter().any(|n| *n != 0) {
        leads.push(numbers[0]);
        numbers = get_diffs(&numbers);
    }

    let mut prev_digit = 0;
    leads.iter().rev().for_each(|n| {
        prev_digit = *n - prev_digit;
    });

    prev_digit
}

fn parse_numbers(line: &str) -> Vec<i32> {
    line.split(' ')
        .map(|n| n.parse::<i32>().unwrap())
        .collect::<Vec<i32>>()
}

fn get_diffs(numbers: &Vec<i32>) -> Vec<i32> {
    let mut diffs = Vec::new();
    for i in 0..numbers.len() - 1 {
        diffs.push(numbers[i + 1] - numbers[i]);
    }
    diffs
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d9-ex1.txt", 1).unwrap(), 114);
        assert_eq!(main("./inputs/d9.txt", 1).unwrap(), 1834108701);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d9-ex1.txt", 2).unwrap(), 2);
        assert_eq!(main("./inputs/d9.txt", 2).unwrap(), 993);
    }
}
