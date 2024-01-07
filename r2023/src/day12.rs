use std::{error::Error, iter::Sum};

use memoize::memoize;

use crate::utils;

pub fn run() {
    println!("Running D12...");
    println!("Part 1: {}", main("./inputs/d12.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d10.txt").unwrap());
}

//TODO DEBUG the first example test - should be recursively memoized solution now
//TODO implement with a DFA

fn main(input: &str) -> Result<usize, Box<dyn Error>> {
    let lines = utils::read_lines(input)?.map(|l| l.unwrap());
    let mut total = 0;
    for line in lines {
        let parts = line.split(' ').collect::<Vec<&str>>();
        let springs = parts[0].chars().collect::<Vec<char>>();
        let runs = parts[1]
            .split(',')
            .map(|s| s.parse::<usize>().unwrap())
            .collect();
        total += count_arrangements(springs, runs);
    }

    Ok(total)
}

#[memoize]
fn count_arrangements(line: Vec<char>, runs: Vec<usize>) -> usize {
    if line.is_empty() {
        if runs.is_empty() {
            return 1;
        } else {
            return 0;
        }
    }

    if runs.is_empty() {
        if line.iter().any(|c| *c == '#') {
            return 0;
        }
        return 1;
    }

    if line.len() < (runs.iter().sum::<usize>() + runs.len() - 1) {
        return 0;
    }

    if line[0] == '.' {
        return count_arrangements(line[1..].to_vec(), runs);
    }
    if line[0] == '#' {
        let run = runs[0];
        let leftover_runs = runs[1..].to_vec();
        for i in 0..run {
            if line[i] == '.' {
                return 0;
            }
        }

        if (line[run] == '#') {
            return 0;
        }

        return count_arrangements(line[1..].to_vec(), leftover_runs);
    }

    let mut new_line = line[1..].to_vec();
    new_line.insert(0, '#');
    count_arrangements(new_line, runs)
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
        assert_eq!(
            count_arrangements("???.###".chars().collect(), vec![1, 1, 3]),
            1
        );
    }
}
