#[allow(dead_code)]
use std::fmt::Debug;
use std::fs::File;
use std::io::{self, BufRead, BufReader, Error, Lines};
use std::path::Path;
use std::iter::Map;

pub type LinesIterator = Map<Lines<BufReader<File>>, fn(Result<String, Error>) -> String>;

pub fn read_lines<P>(filename: P) -> io::Result<Lines<BufReader<File>>>
where
    P: AsRef<Path> + Debug,
{
    let file = File::open(filename)?;
    Ok(BufReader::new(file).lines())
}

pub fn get_line_groups<P>(filename: P) -> io::Result<Vec<Vec<String>>>
where
    P: AsRef<Path> + Debug,
{
    let lines = read_lines(filename)?.map(|l| l.unwrap());
    let mut line_groups = vec![];
    let mut group = vec![];
    for line in lines {
        if line.is_empty() {
            line_groups.push(group);
            group = vec![];
        } else {
            group.push(line);
        }
    }
    line_groups.push(group);
    Ok(line_groups)
}

pub fn flood_fill(
    grid: &[Vec<char>],
    start: (usize, usize),
    marker: Option<char>,
) -> Vec<Vec<char>> {
    let marker = marker.unwrap_or('X');
    let mut marked = vec![];
    let mut queue = vec![start];
    let mut flooded = grid.to_vec();
    while let Some(current) = queue.pop() {
        let neighbors = get_neighbors(grid, current);
        for neighbor in neighbors {
            if !marked.contains(&neighbor) {
                marked.push(neighbor);
                queue.push(neighbor);
            }
        }
        flooded[current.1][current.0] = marker;
    }
    println!("Flooded:");
    for row in flooded.iter_mut() {
        println!("{:?}", row.iter().collect::<String>());
    }
    flooded
}

pub fn get_neighbors(grid: &[Vec<char>], start: (usize, usize)) -> Vec<(usize, usize)> {
    let (x, y) = start;
    let mut neighbors = vec![];
    if y > 0 {
        neighbors.push((x, y - 1));
    }
    if x < grid[0].len() - 1 {
        neighbors.push((x + 1, y));
    }
    if y < grid.len() - 1 {
        neighbors.push((x, y + 1));
    }
    if x > 0 {
        neighbors.push((x - 1, y));
    }
    neighbors
}

pub fn print_grid(grid: &[Vec<char>]) {
    for row in grid.iter() {
        println!("{:?}", row.iter().collect::<String>());
    }
}

pub fn manhattan(p1: (usize, usize), p2: (usize, usize)) -> usize {
    ((p1.0 as i32 - p2.0 as i32).abs() + (p1.1 as i32 - p2.1 as i32).abs()) as usize
}