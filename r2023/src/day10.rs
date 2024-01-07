#![allow(dead_code)]
use std::error::Error;

use crate::utils;

pub fn run() {
    println!("Running D10...");
    println!("Part 1: {}", main("./inputs/d10.txt").unwrap().0);
    println!("Part 2: {}", main("./inputs/d10.txt").unwrap().1);
}

fn main(input: &str) -> Result<(i32, i32), Box<dyn Error>> {
    let rows = utils::read_lines(input)?
        .map(|l| l.unwrap())
        .map(|l| l.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();

    let (grid, dist) = plot_pipe(&rows);
    let p1 = dist as i32 / 2;
    let p2 = p2(grid)?;
    Ok((p1, p2))
}

fn p2(grid: Vec<Vec<char>>) -> Result<i32, Box<dyn Error>> {
    let mut dots_inside = 0;
    for row in grid {
        let mut inside = false;
        for c in row {
            if c == '.' && inside {
                dots_inside += 1;
            }
            if matches!(c, '|' | 'L' | 'J') {
                inside = !inside;
            }
        }
    }

    Ok(dots_inside)
}

fn plot_pipe(rows: &[Vec<char>]) -> (Vec<Vec<char>>, usize) {
    let mut grid: Vec<Vec<char>> = rows
        .iter()
        .map(|r| r.iter().map(|_| '.').collect())
        .collect();

    let start = find_start(rows);
    let (mut x, mut y) = start;
    let mut last = start;
    let mut dist = 0;
    let start_type = get_start_type(rows, start);

    loop {
        if (x, y) == start {
            grid[y][x] = start_type
        } else {
            grid[y][x] = rows[y][x];
        }

        let neighbors = get_connections(rows, (x, y));
        let next = if neighbors[0] == last {
            neighbors[1]
        } else {
            neighbors[0]
        };
        dist += 1;
        last = (x, y);
        (x, y) = next;
        if next == start {
            break;
        }
    }

    (grid, dist)
}

fn get_connections(grid: &[Vec<char>], start: (usize, usize)) -> Vec<(usize, usize)> {
    let mut pipe = grid[start.1][start.0];
    if pipe == 'S' {
        pipe = get_start_type(grid, start);
    }
    let (x, y) = start;
    match pipe {
        '|' => vec![(x, y - 1), (x, y + 1)],
        '-' => vec![(x - 1, y), (x + 1, y)],
        'L' => vec![(x, y - 1), (x + 1, y)],
        'J' => vec![(x, y - 1), (x - 1, y)],
        '7' => vec![(x - 1, y), (x, y + 1)],
        'F' => vec![(x, y + 1), (x + 1, y)],
        '.' => vec![],
        _ => panic!("Invalid pipe"),
    }
}

fn find_start(rows: &[Vec<char>]) -> (usize, usize) {
    rows.iter()
        .enumerate()
        .find_map(|(y, row)| {
            row.iter()
                .enumerate()
                .find_map(|(x, c)| if c == &'S' { Some((x, y)) } else { None })
        })
        .expect("Unable to find start")
}

fn get_start_type(grid: &[Vec<char>], start: (usize, usize)) -> char {
    let (x, y) = start;
    let mut connections = vec![];

    if y > 0 && matches!(grid[y - 1][x], '|' | '7' | 'F') {
        connections.push('N');
    }

    if x < grid[0].len() - 1 && matches!(grid[y][x + 1], '-' | '7' | 'J') {
        connections.push('E');
    }

    if y < grid.len() - 1 && matches!(grid[y + 1][x], '|' | 'L' | 'J') {
        connections.push('S');
    }

    if x > 0 && matches!(grid[y][x - 1], '-' | 'L' | 'F') {
        connections.push('W');
    }

    match connections[..] {
        ['N', 'E'] => 'L',
        ['N', 'W'] => 'J',
        ['N', 'S'] => '|',
        ['E', 'S'] => 'F',
        ['E', 'W'] => '-',
        ['S', 'W'] => '7',
        _ => panic!("Invalid start connections"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d10-ex1.txt").unwrap().0, 4);
        assert_eq!(main("./inputs/d10.txt").unwrap().0, 6931);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d10-ex1.txt").unwrap().1, 1);
        assert_eq!(main("./inputs/d10-ex2.txt").unwrap().1, 4);
        assert_eq!(main("./inputs/d10-ex3.txt").unwrap().1, 4);
        assert_eq!(main("./inputs/d10-ex4.txt").unwrap().1, 8);
        assert_eq!(main("./inputs/d10-ex5.txt").unwrap().1, 10);
        assert_eq!(main("./inputs/d10.txt").unwrap().1, 357);
    }
}
