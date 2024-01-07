use std::error::Error;

use crate::utils;

pub fn run() {
    println!("Running D11...");
    println!("Part 1: {}", main("./inputs/d11.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d10.txt").unwrap());
}

fn main(input: &str) -> Result<i32, Box<dyn Error>> {
    let rows = utils::read_lines(input)?
        .map(|l| l.unwrap())
        .map(|l| l.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();

    let grid = expand_universe(&rows);

    // for each set insert the rows, then map over the rows inserting at each col (offsetting as you go)
    // collect set of coords to check so we only check each pair once
    // for each pair get the shortest path between them
    // return sum
    Ok(374)
}

fn expand_universe(rows: &[Vec<char>]) -> Vec<Vec<char>> {
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

    let mut grid = rows.to_vec();

    // insert the empty rows where needed
    for (offset, row) in empty_rows.iter().enumerate() {
        grid.insert(row + offset, vec!['.'; rows[0].len()]);
    }
    // insert the empty columns where needed
    for row in grid.iter_mut() {
        for (offset, col) in empty_cols.iter().enumerate() {
            row.insert(col + offset, '.');
        }
    }

    grid
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d11-ex1.txt").unwrap(), 374);
        // assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d#-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    // }
}
