#[allow(unused)]
use aoc_utils::{read_lines, LinesIterator};
use anyhow::Result;
use std::cmp::Ordering;

type Report=Vec<i32>;

pub fn run() {
    println!("Running D2...");
    println!("Part 1: {}", main("./inputs/d2.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d2.txt").unwrap());
}

fn main(input: &str) -> Result<i32> {
    let reports: Vec<Report> = read_lines(input)?
        .map(|l| l.expect("unable to parse line").into_report()).collect();

    let result = reports.iter().filter(|r| is_safe(r)).count();
    Ok(result as i32)
}

trait StringUtils {
    fn into_report(self) -> Report;
}

impl StringUtils for String {
    fn into_report(self) -> Report {
        self.split_whitespace().filter_map(|n| n.parse().ok()).collect()
    }
}

fn is_safe(report: &Report) -> bool {
   let mut left = 0;
   let mut right = 1;
   let direction = report[left].cmp(&report[right]);
   if direction == Ordering::Equal {return false};
    while right < report.len() {
       let a = report[left];
       let b = report[right];
       let diff = (a - b).abs();
        if diff < 1 || diff > 3 || a.cmp(&b) != direction {return false}
       right += 1;
        left += 1;
    }
    
   true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d2-ex1.txt").unwrap(), 2);
        // assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d#-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    // }
}
