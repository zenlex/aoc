use std::collections::HashMap;
use anyhow::Result;
use aoc_utils::{
    LinesIterator
};
use regex::Regex;

pub fn run() {
    println!("Running D1...");
    println!("Part 1: {}", main("./inputs/d1.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d1.txt", 2).unwrap());
}

fn main(input: &str, part: u8) -> Result<i32> {
    let lines: LinesIterator = aoc_utils::read_lines(input)?
        .map(|l| l.unwrap());
    let (list1, list2) = parse_lists(lines);
    let result = match part {
        1 => sum_sorted_diffs(list1, list2),
        2 => get_similarity_score(list1, list2),
        _ => panic!("unexpected part")
    };

    Ok(result)
}

fn parse_lists(lines: LinesIterator) -> (Vec<i32>, Vec<i32>)
{
    let mut list_a: Vec<i32> = vec![];
    let mut list_b: Vec<i32> = vec![];
    let re = Regex::new(r"^(\d+)\s{3}(\d+)$").expect("invalid regex");
    for line in lines {
        let (a,b) = re.captures(&line).and_then(|cap| {
            Some((cap[1].parse().ok()?,
            cap[2].parse().ok()?))
        }).expect("unable to parse line");
        list_a.push(a);
        list_b.push(b);
    }
    (list_a, list_b)
}

fn sum_sorted_diffs(mut list1: Vec<i32>, mut list2: Vec<i32>) -> i32
{
    list1.sort();
    list2.sort();

    list1.iter()
        .zip(list2.iter())
        .map(|(a, b)| (a - b).abs())
        .sum()
}

fn get_similarity_score(list1: Vec<i32>, list2: Vec<i32>) -> i32 {
    let mut freq2: HashMap<i32, i32> = HashMap::new();
    list2.iter().for_each(|n| {
        *freq2.entry(*n).or_insert(0) += 1
    });
    list1.iter().map(|n| {
        *n * freq2.get(n).unwrap_or(&0)
    }).sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d1-ex1.txt", 1).unwrap(), 11);
        assert_eq!(main("./inputs/d1.txt", 1).unwrap(), 2367773);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d1-ex1.txt", 2).unwrap(), 31);
    }
}
