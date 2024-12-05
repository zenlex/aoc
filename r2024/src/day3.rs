#[allow(unused)]
use aoc_utils::{read_lines, LinesIterator};
use anyhow::Result;
use regex::Regex;

#[allow(dead_code)]
pub fn run() {
    println!("Running D3...");
    println!("Part 1: {}", main("./inputs/d3.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d3.txt", 2).unwrap());
}

fn main(input: &str, part: u8) -> Result<i32> {
    let lines: Vec<String> = read_lines(input)?.map(|l| l.expect("unable to parse line")).collect();
    let bypass = match part {
        1 => true,
        2 => false,
        _ => panic!("invalid part")
    };
    let result = sum_of_products(lines, bypass);
    Ok(result)
}

fn sum_of_products(lines: Vec<String>, bypass:bool) -> i32 {
   let mut enabled = true;
   let re = Regex::new(r"(don't\(\))|(do\(\))|(mul\(\d+,\d+\))").expect("invalid regex");
    let mut products = vec![];
    lines.iter().for_each(|line| {
       re.captures_iter(line).for_each(|cap| {
           let instruction = cap.get(0).unwrap().as_str();
           match instruction{
               "don't()" => enabled = false,
               "do()" => enabled = true,
               _ => match enabled || bypass {
                   true => products.push(parse_mult_op(instruction)),
                   false => {}
               }
           }
       })
   });

   products.iter().sum()
}

fn parse_mult_op(op: &str) -> i32 {
    let re = Regex::new(r"\((\d+),(\d+)\)").expect("invalid regex");

    let cap = re.captures(op).unwrap();
    let x: i32 = cap.get(1).map(|m| m.as_str().parse().expect("unable to parse x")).unwrap();
    let y: i32 = cap.get(2).map(|m| m.as_str().parse().expect("unable to parse x")).unwrap();
    x * y
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d3-ex1.txt", 1).unwrap(), 161);
        assert_eq!(main("./inputs/d3.txt", 1).unwrap(), 157621318);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d3-ex2.txt", 2).unwrap(), 48);
        assert_eq!(main("./inputs/d3.txt", 2).unwrap(), 79845780);
    }
}
