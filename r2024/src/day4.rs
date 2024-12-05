use std::cmp::PartialEq;
#[allow(unused)]
use aoc_utils::*;
use anyhow::Result;

const DIRECTIONS:[(i32,i32);8] = [
    (-1,-1),(-1,0),(-1,1),
    (0,-1),        (0, 1),
    (1,-1), (1,0), (1, 1)
];

#[derive(Debug, Clone, Eq, PartialEq)]
enum XmasState {
    X,
    M,
    A,
    S,
    Complete,
    Invalid
}

impl XmasState {
    fn next(&self) -> Self {
        match self {
            XmasState::X => XmasState::M,
            XmasState::M => XmasState::A,
            XmasState::A => XmasState::S,
            XmasState::S => XmasState::Complete,
            _ => XmasState::Invalid
        }
    }

    fn expected(&self) -> Option<Self> {
        match self {
            XmasState::X => Some(XmasState::M),
            XmasState::M => Some(XmasState::A),
            XmasState::A => Some(XmasState::S),
            XmasState::S => Some(XmasState::Complete),
            _ => None,
        }
    }
}

impl From<char> for XmasState {
    fn from(item: char) -> Self {
        match item {
            'X' => XmasState::X,
            'M' => XmasState::M,
            'A' => XmasState::A,
            'S' => XmasState::S,
            _ => XmasState::Invalid
        }
    }
}

#[allow(dead_code)]
pub fn run() {
    println!("Running D4...");
    println!("Part 1: {}", main("./inputs/d4.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d4.txt", 2).unwrap());
}

fn main(input: &str, part: u8) -> Result<i32> {
    let grid = to_char_grid(input)?;
    let height = grid.height();
    let width = grid.width();
    let result = match part {
        1 => count_all_xmas(grid, height, width)?,
        2 => count_all_x_mas(&grid, height, width),
        _ => panic!("unexpected part")
    };
    Ok(result)
}

fn count_all_xmas(grid: CharGrid, height: usize, width: usize) -> Result<i32>
{
   let mut total = 0;
    for r in 0..height {
        for c in 0..width {
           if let Some('X') = grid.get(Point(r as i32,c as i32)) {
               total += count_xmas_at_pos(&grid, Point(r as i32, c as i32))
           }
        }
    }

   Ok(total)
}

fn count_xmas_at_pos(grid: &CharGrid, start: Point) -> i32
{
    let mut count = 0;

   for direction in DIRECTIONS.iter(){
        if is_xmas(grid, start, direction) {
            count += 1
        }
   }

    count
}

fn is_xmas(grid:&CharGrid, start: Point, direction: &(i32, i32)) -> bool
{
    let mut state = XmasState::X;
    let mut search = start;

    loop  {
        if state == XmasState::Complete { return true };
        if state == XmasState::Invalid { return false };

        search.0 = search.0 + direction.0;
        search.1 = search.1 + direction.1;

        if grid.is_out_of_bounds(Point(search.0, search.1)){
            return false;
        }
        
        let current = grid.get(Point(search.0, search.1)).expect("invalid char in grid");
        let expected_state = state.expected();

        match expected_state {
            Some(expected) if current == 'S' && expected == XmasState::S => {
                state = XmasState::Complete;
            }
            Some(expected) if XmasState::from(current) == expected => {
                state = state.next();
            }
            _ => {
                state = XmasState::Invalid
            }
        }
    }
}

// PART 2
fn count_all_x_mas(grid: &CharGrid, height: usize, width: usize) -> i32
{
    let mut total = 0;
    // can count in 1 from edge for A's
    for r in 1..height - 1 {
        for c in 1..width - 1 {
            if let Some(char) = grid.get(Point(r as i32,c as i32)) {
                match char {
                    'A' => {
                        if is_x_mas(grid, Point(r as i32, c as i32)) { total += 1 }
                    },
                    _ => {}
                }
            }
        }
    }

    total
}

fn is_x_mas(grid: &CharGrid, start: Point) -> bool
{
    let corners = [
        (start.0 - 1,start.1 - 1),
        (start.0 - 1,start.1 + 1),
        (start.0 + 1,start.1 - 1),
        (start.0 + 1,start.1 + 1)
      ];

    let chars: Vec<_> = corners.iter().map(|&(r, c)| grid.get(Point(r, c)).unwrap_or('.')).collect();

    (chars[0] == 'M' && chars[2] == 'S' || chars[0] == 'S' && chars[2] == 'M')
    && (chars[1] == 'M' && chars[3] == 'S' || chars[1] == 'S' && chars[3] == 'M')
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d4-ex1.txt", 1).unwrap(), 18);
        assert_eq!(main("./inputs/d4.txt", 1).unwrap(), 2414);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d4-ex1.txt", 2).unwrap(), 9);
        assert_eq!(main("./inputs/d4.txt", 2).unwrap(), 1871);
    }
}
