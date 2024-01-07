use std::{collections::HashSet, error::Error};

use crate::utils;

pub fn run() {
    println!("Running D11...");
    println!("Part 1: {}", main("./inputs/d11.txt", 2).unwrap());
    println!("Part 2: {}", main("./inputs/d11.txt", 1000000).unwrap());
}

fn main(input: &str, expansion_factor: usize) -> Result<usize, Box<dyn Error>> {
    let rows = utils::read_lines(input)?
        .map(|l| l.unwrap())
        .map(|l| l.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();

    let galaxies = expand_universe(&rows, expansion_factor);

    let mut galaxy_pairs = HashSet::new();
    for (i, galaxy1) in galaxies.iter().enumerate() {
        for galaxy2 in galaxies.iter().skip(i + 1) {
            galaxy_pairs.insert((*galaxy1, *galaxy2));
        }
    }

    let mut shortest_paths = vec![];
    for pair in galaxy_pairs {
        let path = utils::manhattan(pair.0, pair.1);
        shortest_paths.push(path);
    }

    Ok(shortest_paths.iter().sum::<usize>())
}

fn expand_universe(rows: &[Vec<char>], factor: usize) -> Vec<(usize, usize)> {
    let mut empty_rows = vec![];
    let mut empty_cols = vec![];

    for (y, row) in rows.iter().enumerate() {
        if row.iter().all(|c| *c == '.') {
            empty_rows.push(y);
        }
    }

    for x in 0..rows[0].len() {
        if rows.iter().all(|r| r[x] == '.') {
            empty_cols.push(x);
        }
    }

    let mut galaxies: Vec<(usize, usize)> =
        rows.iter().enumerate().fold(vec![], |mut acc, (y, row)| {
            for (x, col) in row.iter().enumerate() {
                if *col == '#' {
                    acc.push((x, y));
                }
            }
            acc
        });

    for galaxy in galaxies.iter_mut() {
        galaxy.1 += empty_rows.iter().filter(|r| **r < galaxy.1).count() * (factor - 1);
        galaxy.0 += empty_cols.iter().filter(|c| **c < galaxy.0).count() * (factor - 1);
    }

    galaxies
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d11-ex1.txt", 2).unwrap(), 374);
        assert_eq!(main("./inputs/d11.txt", 2).unwrap(), 10231178);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d11-ex1.txt", 10).unwrap(), 1030);
        assert_eq!(main("./inputs/d11-ex1.txt", 100).unwrap(), 8410);
    }
}
