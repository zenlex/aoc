use std::collections::{HashMap, HashSet};
#[allow(unused)]
use aoc_utils::{read_lines, LinesIterator};
use anyhow::Result;
use regex::Regex;

type Rules = HashMap<i32, HashSet<i32>>;
#[allow(dead_code)]
pub fn run() {
    println!("Running D5...");
    println!("Part 1: {}", main("./inputs/d5.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d5.txt", 2).unwrap());
}

fn main(input: &str, part: u8) -> Result<i32> {
    let lines: LinesIterator = read_lines(input)?.map(|l| l.expect("unable to parse line"));
    let re = Regex::new(r"(\d+)\|(\d+)").expect("invalid regex");
    let mut sequences: Vec<Vec<i32>> = vec![];
    let mut rules_map: Rules = HashMap::new();

    for line in lines {
        if line.is_empty() { continue; }
        if line.contains("|"){
            let caps = re.captures(&line).expect("regex failure");
            let k = caps[1].parse()?;
            let v = caps[2].parse()?;
            rules_map.entry(k).or_default().insert(v);
        }else {
            sequences.push(line.split(",").map(|n| n.parse::<i32>().expect("unable to parse int")).collect())
        }
    }

    let result = match part {
            1 => p1(&sequences, &rules_map)?,
            2 => p2(&sequences, &mut rules_map)?,
            _ => panic!("bad part")
        };
    Ok(result)
}

fn p1(sequences: &[Vec<i32>], rules_map:&Rules) -> Result<i32> {
    let valid_sequences: Vec<&Vec<i32>> = sequences.iter().filter(|&s| is_safe(&s, &rules_map)).collect();
    let sum = valid_sequences.iter().map(|s| middle(s)).sum();

    Ok(sum)
}

fn p2(sequences:&[Vec<i32>], rules_map:&mut Rules) -> Result<i32> {
    let invalid_sequences: Vec<&Vec<i32>> = sequences.iter().filter(|&s| !is_safe(&s, &rules_map)).collect();
    let sum = invalid_sequences.iter().map(|&s| fix(s, rules_map)).map(|s| middle(&s)).sum();

    Ok(sum)
}

fn fix(seq: &[i32], rules: &mut Rules) -> Vec<i32>
{
    // Topological Sort
    // Filter the rules graph to only nodes in the sequence
    // Use Kahns or DFS to topologically sort the graph nodes, return sorted nodes

    let filtered_rules:Rules = rules.iter()
        .filter(|(node, _)| seq.contains(node))
        .map(|(node, neighbors)| {
            let filtered_neighbors = neighbors.iter()
                .filter(|n| seq.contains(n))
                .cloned().collect::<HashSet<i32>>();
            (*node, filtered_neighbors)
        }).collect();

    // Kahns algo
    let mut in_degrees:HashMap<&i32, i32> = HashMap::new();

    for (node, neighbors) in &filtered_rules {
        in_degrees.entry(node).or_insert(0);
        for neighbor in neighbors {
            *in_degrees.entry(neighbor).or_insert(0) += 1;
        }
    }

    let mut zero_in_degrees:HashSet<i32> = HashSet::new();

    for(&node, &degree) in &in_degrees {
        if degree == 0 {
            zero_in_degrees.insert(*node);
        }
    }

    let mut fixed:Vec<i32> = vec![];

    while !zero_in_degrees.is_empty() {
        let node = zero_in_degrees.iter().next().cloned().unwrap();
        fixed.push(node);

        if let Some(neighbors) = filtered_rules.get(&node) {
            for &neighbor in neighbors {
                if let Some(degree) = in_degrees.get_mut(&neighbor) {
                    *degree -= 1;
                    if *degree == 0 {
                        zero_in_degrees.insert(neighbor);
                    }
                }
            }
        }
        zero_in_degrees.remove(&node);
    }

    fixed
}


fn is_safe(sequence: &Vec<i32>, rules:&Rules) -> bool {
   for (i, n) in sequence.iter().enumerate() {
       if sequence[..i].iter().any(|&x| rules.get(&n).map_or(false, |deps| deps.contains(&x))) {
           return false;
       }
   }
    true
}

fn middle(sequence: &Vec<i32>) -> i32 {
    if sequence.is_empty() {return 0;}
    sequence[sequence.len() / 2]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d5-ex1.txt", 1).unwrap(), 143);
        assert_eq!(main("./inputs/d5.txt", 1).unwrap(), 7365);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d5-ex1.txt", 2).unwrap(), 123);
        assert_eq!(main("./inputs/d5.txt", 2).unwrap(), 5770);
    }
}
