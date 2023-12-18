use core::panic;
use std::{
    cmp::{max, min},
    error::Error,
    vec,
};

use crate::utils;

type Seeds = Vec<(usize, usize)>;
type Locations = Vec<usize>;

//(dst, src, len)
type Map = Vec<(usize, usize, usize)>;

pub fn run() {
    println!("Running D5..");
    println!("Part 1: {}", main("./inputs/d5.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d5.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<usize, Box<dyn Error>> {
    let line_groups = utils::get_line_groups(input)?;
    let seeds = get_seed_ranges(&line_groups[0][0], part);

    let maps: Vec<Map> = line_groups
        .iter()
        .skip(1)
        .map(|group| {
            let mut map = Vec::new();
            for line in group.iter().skip(1) {
                let mut parts = line.split(' ');
                let destination = parts.next().unwrap().parse::<usize>().unwrap();
                let source = parts.next().unwrap().parse::<usize>().unwrap();
                let range = parts.next().unwrap().parse::<usize>().unwrap();
                map.push((destination, source, range));
            }
            map
        })
        .collect();

    let locations = get_locations(seeds, maps);
    Ok(*locations.iter().min().expect("No locations found\n"))
}

fn get_seed_ranges(input: &str, part: usize) -> Vec<(usize, usize)> {
    let values: Vec<usize> = input[7..]
        .split(' ')
        .collect::<Vec<_>>()
        .iter()
        .map(|s| s.parse::<usize>().unwrap())
        .collect();

    let mut seeds = vec![];

    let mut i = 0;
    while i < values.len() {
        let start = values[i];
        let end;
        match part {
            1 => {
                end = start;
                i += 1
            }
            2 => {
                end = start + values[i + 1] - 1;
                i += 2
            }
            _ => panic!("Invalid part"),
        };
        seeds.push((start, end));
    }

    seeds
}

fn get_locations(seeds: Seeds, pipeline: Vec<Map>) -> Locations {
    let mut result = seeds.clone();
    for map in pipeline.iter() {
        result = transform(result, map);
    }
    result.iter().map(|item| item.0).collect()
}

fn transform(seed_ranges: Vec<(usize, usize)>, map: &Map) -> Vec<(usize, usize)> {
    // add new range to output for each split
    let mut ranges = seed_ranges.clone();
    let mut new_ranges = vec![];
    let mut cut_ranges = vec![];
    for (dst, src, len) in map {
        let istart = src;
        let iend = src + len - 1;

        cut_ranges = vec![];
        for (start, end) in ranges {
            //range intersects
            if intersects(start, end, *istart, iend) {
                let i1 = max(start, *istart);
                let i2 = min(end, iend);
                new_ranges.push((i1 + dst - src, i2 + dst - src));
                if start < *istart {
                    cut_ranges.push((start, istart - 1));
                }
                if end > iend {
                    cut_ranges.push((iend + 1, end));
                }
            } else {
                cut_ranges.push((start, end));
            }
        }
        ranges = cut_ranges.to_vec();
    }
    new_ranges.append(&mut cut_ranges);
    new_ranges
}

fn intersects(a: usize, b: usize, c: usize, d: usize) -> bool {
    !(a > d || c > b)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d5-ex1.txt", 1).unwrap(), 35);
        assert_eq!(main("./inputs/d5.txt", 1).unwrap(), 331445006);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d5-ex1.txt", 2).unwrap(), 46);
        assert_eq!(main("./inputs/d5.txt", 2).unwrap(), 6472060);
        // assert_eq!(main("./inputs/d5.txt", 2).unwrap(), 0);
    }

    #[test]
    fn test_seed_ranges() {
        assert_eq!(
            get_seed_ranges("seeds: 79 14 55 13", 2),
            vec![(79, 92), (55, 67)]
        );
    }
}
