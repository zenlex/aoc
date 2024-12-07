use std::collections::HashSet;
#[allow(unused)]
use aoc_utils::{read_lines, LinesIterator};
use anyhow::Result;
use aoc_utils::{to_char_grid, CharGrid, Point};

#[allow(dead_code)]
pub fn run() {
    println!("Running D6...");
    println!("Part 1: {}", main("./inputs/d6.txt", 1).unwrap());
    // println!("Part 2: {}", main("./inputs/d6.txt", 2).unwrap());
}

enum Direction {
    North,
    East,
    South,
    West
}

impl Direction {
    fn to_vector(&self) -> (i8, i8) {
        match self {
            Direction::North => (-1, 0),
            Direction::East=> (0, 1),
            Direction::South => (1, 0),
            Direction::West => (0, -1)
        }
    }
}

struct Guard
{
    pos: Point,
    positions: HashSet<Point>,
    orientation: Direction
}

impl Guard {
    fn init(grid:&CharGrid) -> Self {
      for (i, row) in grid.iter().enumerate() {
          if row.contains(&'^'){
              let start = Point(i as i32, row.iter().position(|c| *c == '^').unwrap() as i32);
              return Self{
                  pos: start,
                  positions: HashSet::from([start]),
                  orientation: Direction::North
              };
          }
      }
        panic!("No guard found")
    }
    fn walk(&mut self) {
        let vector = self.orientation.to_vector();
        self.pos.0 += vector.0 as i32;
        self.pos.1 += vector.1 as i32;
        self.positions.insert(self.pos);
    }

    fn next_pos(&mut self) -> Point {
        let vector = self.orientation.to_vector();
        Point(self.pos.0 + vector.0 as i32,
        self.pos.1 + vector.1 as i32)
    }

    fn turn_right(&mut self) {
        self.orientation = match self.orientation {
            Direction::North => Direction::East,
            Direction::East => Direction::South,
            Direction::South => Direction::West,
            Direction::West => Direction::North
        }
    }
}

fn main(input: &str, _part: u8) -> Result<i32> {
    let grid = to_char_grid(input)?;
    let result = p1(grid)?;
    Ok(result)
}

fn p1(grid:CharGrid) -> Result<i32> {
    let mut guard = Guard::init(&grid);
    while grid.get(guard.pos).is_some() {
        guard.positions.insert(guard.pos);
        guard.walk();
        match grid.get(guard.next_pos()){
            Some(char) if char == '#' => guard.turn_right(),
            Some(_) => {},
            None => break
        }
    }
    Ok(guard.positions.len() as i32)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d6-ex1.txt", 1).unwrap(), 41);
        assert_eq!(main("./inputs/d6.txt", 1).unwrap(), 5318);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d6-ex2.txt", 2).unwrap(), 0);
    //     assert_eq!(main("./inputs/d6.txt", 2).unwrap(), 0);
    // }
}
