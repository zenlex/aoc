#![allow(dead_code)]
use std::error::Error;

use crate::utils;

pub fn run() {
    println!("Running D6..");
    println!("Part 1: {}", main("./inputs/d6.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d6.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<u64, Box<dyn Error>> {
    let lines = utils::read_lines(input)?.map(|l| l.unwrap());
    let re = regex::Regex::new(r"(\d+)")?;
    let mut vals = vec![];
    match part {
        1 => {
            for line in lines {
                vals.push(
                    re.find_iter(&line)
                        .map(|m| m.as_str().parse::<u64>().unwrap())
                        .collect::<Vec<u64>>(),
                );
            }
        }
        2 => {
            for line in lines {
                vals.push(vec![re
                    .find_iter(&line)
                    .map(|m| m.as_str())
                    .fold(String::new(), |acc, s| acc + s)
                    .parse::<u64>()
                    .unwrap()]);
            }
        }
        _ => panic!("Invalid part"),
    }

    let mut options = vec![];
    let times = &vals[0];
    let distances = &vals[1];
    for race in 0..times.len() {
        let mut hold = 1;
        let mut dist = distance(times[race], hold);
        while dist <= distances[race] {
            hold += 1;
            dist = distance(times[race], hold);
        }
        let min = hold;
        hold = times[race] - 1;
        dist = distance(times[race], hold);
        while dist <= distances[race] {
            hold -= 1;
            dist = distance(times[race], hold);
        }
        let max = hold;
        options.push(max - min + 1);
    }

    Ok(options.iter().product())
}

fn distance(time: u64, hold: u64) -> u64 {
    time.checked_sub(hold).unwrap() * hold
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d6-ex1.txt", 1).unwrap(), 288);
        assert_eq!(main("./inputs/d6.txt", 1).unwrap(), 2449062);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d6-ex1.txt", 2).unwrap(), 71503);
        assert_eq!(main("./inputs/d6.txt", 2).unwrap(), 33149631);
    }
}
