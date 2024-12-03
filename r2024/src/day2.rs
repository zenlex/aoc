#[allow(unused)]
use aoc_utils::{read_lines, LinesIterator};
use anyhow::Result;

type Report=Vec<i32>;

pub fn run() {
    println!("Running D2...");
    println!("Part 1: {}", main("./inputs/d2.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d2.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<i32> {
    let reports: Vec<Report> = read_lines(input)?
        .map(|l| l.expect("unable to parse line").into_report()).collect();

    let result = reports.iter().filter(|r| is_safe(r, part)).count();
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

fn is_safe(report: &Report, part: usize) -> bool {
   if report.len() < 3 {return true}

   let mut left = 0;
   let mut right = 1;
   let mut direction = None;
    while right < report.len() {
       let a = report[left];
       let b = report[right];
        if direction.is_none(){
            if a != b {
                direction = Some(a.cmp(&b))
            } else if left > 0 || part == 1{
                return false
            }
        }

        if direction.is_some() {
            let diff = (a - b).abs();
            if diff < 1 || diff > 3 || a.cmp(&b) != direction.unwrap() {
                match part {
                    1 => return false,
                    2 => return is_repairable(report.to_owned()),
                    _ => panic!("Unknown Part")
                }
            }
        }
       right += 1;
       left += 1;
    }
   true
}

fn is_repairable(report: Report) -> bool {
    for rem in 0..report.len() {
        let patched: Report = report
            .iter()
            .enumerate()
            .filter(|(i, _)| i != &rem)
            .map(|(_, val)| val.clone())
            .collect();
        if is_safe(&patched, 1) {
            return true;
        }
    }

    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d2-ex1.txt", 1).unwrap(), 2);
        assert_eq!(main("./inputs/d2.txt", 1).unwrap(), 314);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d2-ex1.txt", 2).unwrap(), 4);
        assert_eq!(main("./inputs/d2.txt", 2).unwrap(), 373);
    }
}
