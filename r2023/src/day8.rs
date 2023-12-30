#![allow(dead_code)]
use std::{collections::HashMap, error::Error};

use regex::Regex;

use crate::utils;

pub fn run() {
    println!("Running D8...");
    println!("Part 1: {}", main("./inputs/d8.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d8.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<usize, Box<dyn Error>> {
    let mut lines = utils::read_lines(input)?.map(|l| l.unwrap());
    let mut pattern = lines.next().unwrap();

    pattern = pattern.chars().collect();

    let mut map: HashMap<String, (String, String)> = HashMap::new();
    let re = Regex::new(r"([A-Z]{3})")?;
    // Build map of l,r tuples
    for line in lines {
        if line.is_empty() {
            continue;
        }
        let rules: Vec<_> = re.find_iter(&line).map(|s| s.as_str()).collect();

        map.insert(
            rules[0].to_string(),
            (rules[1].to_string(), rules[2].to_string()),
        );
    }

    let mut steps = 0;
    let mut cursor = "AAA";
    if part == 1 {
        while cursor != "ZZZ" {
            let (l, r) = map.get(&cursor.to_string()).unwrap();
            let step = pattern.chars().nth(steps % pattern.len()).unwrap();
            if step == 'L' {
                cursor = l;
                steps += 1;
            } else if step == 'R' {
                cursor = r;
                steps += 1;
            }
        }

        return Ok(steps);
    }

    if part == 2 {
        // Get LCM of loop lengths
        let cursors: Vec<_> = map.keys().filter(|k| k.ends_with('A')).collect();
        let lengths: Vec<_> = cursors
            .iter()
            .map(|c| {
                let mut steps = 0;
                let mut cursor = *c;
                while !cursor.ends_with('Z') {
                    let (l, r) = map.get(&cursor.to_string()).unwrap();
                    let step = pattern.chars().nth(steps % pattern.len()).unwrap();
                    steps += 1;
                    cursor = match step {
                        'L' => l,
                        'R' => r,
                        _ => panic!("Invalid step"),
                    };
                }
                steps
            })
            .collect();

        let lcm = lengths.iter().fold(lengths[0], |a, b| get_lcm(a, *b));

        return Ok(lcm);
    }
    Err("Hit the end".into())
}

fn get_lcm(a: usize, b: usize) -> usize {
    (a / get_gcd(a, b)) * b
}

fn get_gcd(a: usize, b: usize) -> usize {
    if b == 0 {
        return a;
    }
    get_gcd(b, a % b)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d8-ex1.txt", 1).unwrap(), 6);
        assert_eq!(main("./inputs/d8.txt", 1).unwrap(), 14429);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d8-ex1.txt", 2).unwrap(), 6);
        assert_eq!(main("./inputs/d8.txt", 2).unwrap(), 10921547990923);
    }
}
