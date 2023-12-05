#![allow(dead_code)]
use std::{
    cmp::{max, min},
    collections::HashMap,
    error::Error,
};

use regex::Regex;

use crate::utils;

pub fn run() {
    println!("Running D3...");
    println!("Part 1: {}", main("./inputs/d3.txt", 1));
    println!("Part 2: {}", main("./inputs/d3.txt", 2));
}

fn main(input: &str, part: usize) -> usize {
    let rows: Vec<String> = utils::read_lines(input)
        .unwrap()
        .map(|line| line.unwrap())
        .collect();

    let max_row = rows.len() - 1;
    let max_col = rows[0].len() - 1;

    let mut grid = GridDef {
        max_row,
        max_col,
        symbol_locations: HashMap::new(),
        star_locations: HashMap::new(),
        numbers: Vec::new(),
    };

    for (row_index, row) in rows.iter().enumerate() {
        parse_row(row, row_index, &mut grid).unwrap();
    }

    match part {
        1 => get_parts_sum(&grid),
        2 => get_gears_sum(&grid),
        _ => panic!("Invalid part number"),
    }
}

fn get_parts_sum(grid: &GridDef) -> usize {
    grid.numbers
        .iter()
        .filter(|candidate| candidate.is_part(grid))
        .fold(0, |acc, part| acc + part.number)
}

fn get_gears_sum(grid: &GridDef) -> usize {
    grid.gears().iter().map(|gear| gear.ratio).sum()
}

fn parse_row(row: &str, index: usize, grid: &mut GridDef) -> Result<(), Box<dyn Error>> {
    let symbols_re = Regex::new(r"[^.\d]").unwrap();
    let symbols: Vec<usize> = symbols_re.find_iter(row).map(|m| m.start()).collect();
    if !symbols.is_empty() {
        grid.symbol_locations.insert(index, symbols);
    }

    let stars_re = Regex::new(r"\*").unwrap();
    let stars: Vec<usize> = stars_re.find_iter(row).map(|m| m.start()).collect();
    if !stars.is_empty() {
        grid.star_locations.insert(index, stars);
    }

    let numbers_re = Regex::new(r"\d+").unwrap();
    let mut numbers = numbers_re
        .find_iter(row)
        .map(|cap| Part {
            row: index,
            start: cap.start(),
            end: cap.end(),
            number: cap.as_str().parse::<usize>().unwrap(),
        })
        .collect();

    grid.numbers.append(&mut numbers);

    Ok(())
}
struct GridDef {
    max_row: usize,
    max_col: usize,
    symbol_locations: HashMap<usize, Vec<usize>>,
    star_locations: HashMap<usize, Vec<usize>>,
    numbers: Vec<Part>,
}

struct Gear {
    ratio: usize,
}

impl GridDef {
    pub fn gears(&self) -> Vec<Gear> {
        let mut gears = Vec::new();
        for entry in &self.star_locations {
            let row = entry.0;
            let star_cols = entry.1;
            for col in star_cols {
                let adjacent_nums = self.adjacent_parts(*row, *col);
                match adjacent_nums.len() {
                    2 => {
                        let ratio = adjacent_nums[0].number * adjacent_nums[1].number;
                        gears.push(Gear { ratio });
                    }
                    _ => continue,
                }
            }
        }
        gears
    }

    fn adjacent_parts(&self, row: usize, col: usize) -> Vec<&Part> {
        let min_row = max(0, row - 1);
        let max_row = min(row + 1, self.max_row);
        self.numbers
            .iter()
            .filter(|part| {
                let min_col = if part.start > 0 { part.start - 1 } else { 0 };
                part.row >= min_row && part.row <= max_row && (min_col..=part.end).contains(&col)
            })
            .collect()
    }
}

struct Part {
    row: usize,
    start: usize,
    end: usize,
    number: usize,
}

impl Part {
    fn is_part(&self, grid: &GridDef) -> bool {
        let min_row = self.row.saturating_sub(1);
        let max_row = min(self.row + 1, grid.max_row);
        let search_start = if self.start > 0 { self.start - 1 } else { 0 };
        let search_end = if self.end > grid.max_col {
            grid.max_col
        } else {
            self.end
        };

        for row in min_row..=max_row {
            if let Some(symbols) = grid.symbol_locations.get(&row) {
                for col in search_start..=search_end {
                    if symbols.contains(&col) {
                        return true;
                    }
                }
            }
        }

        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d3-ex1.txt", 1), 4361);
    }

    #[test]
    fn get_numbers() {
        let mut grid = GridDef {
            max_row: 0,
            max_col: 0,
            symbol_locations: HashMap::new(),
            star_locations: HashMap::new(),
            numbers: Vec::new(),
        };
        let row = "..1..2..34%..";
        parse_row(row, 0, &mut grid).unwrap();
        assert_eq!(grid.numbers.len(), 3);
        assert_eq!(grid.numbers[0].number, 1);
        assert_eq!(grid.numbers[1].number, 2);
        assert_eq!(grid.numbers[2].number, 34);
    }

    #[test]
    fn get_symbols() {
        let mut grid = GridDef {
            max_row: 0,
            max_col: 0,
            symbol_locations: HashMap::new(),
            star_locations: HashMap::new(),
            numbers: Vec::new(),
        };
        let row = ".@.#.$.%.&.*.-.=.+123";
        parse_row(row, 0, &mut grid).unwrap();
        assert_eq!(grid.symbol_locations.get(&0).unwrap().len(), 9);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d3-ex1.txt", 2), 467835);
        assert_eq!(main("./inputs/d3.txt", 2), 84900879);
    }
}
