#[allow(unused)]
use aoc_utils::*;
use anyhow::Result;

#[derive(Copy, Clone, Debug, Eq, PartialEq)]
struct Point(i32, i32);

const DIRECTIONS:[(i32,i32);8] = [
    (-1,-1),(-1,0),(-1,1),
    (0,-1),        (0, 1),
    (1,-1), (1,0), (1, 1)
];
#[allow(dead_code)]
pub fn run() {
    println!("Running D4...");
    println!("Part 1: {}", main("./inputs/d4.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d4.txt", 2).unwrap());
}

fn main(input: &str, part: u8) -> Result<i32> {
    let grid = to_char_grid(input)?;
    let result = match part {
        1 => count_all_xmas(grid)?,
        2 => count_all_x_mas(&grid),
        _ => panic!("unexpected part")
    };
    Ok(result)
}

fn count_all_xmas(grid: CharGrid) -> Result<i32>
{
   let mut total = 0;
    let height = grid.len();
    let width = grid[0].len();

    for r in 0..height {
        for c in 0..width {
           match grid[r][c] {
               'X' => {
                   total += count_xmas_at_pos(&grid, Point(r as i32, c as i32))
               }
               _ => {}
           }
        }
    }

   Ok(total)
}

fn count_xmas_at_pos(grid: &CharGrid, start: Point) -> i32
{
    let mut count = 0;

   for direction in DIRECTIONS.iter(){
        if is_xmas(grid, start, direction) {count += 1}
   }

    count
}

fn is_xmas(grid:&CharGrid, start: Point, direction: &(i32, i32)) -> bool
{
    let mut expected = 'M';
    let mut search = start;

    loop  {
        if expected == '*' {return true};
        if expected == '.' {return false};

        let new_row = search.0 + direction.0;
        let new_col = search.1 + direction.1;

        if new_row < 0 || new_row >= grid.len() as i32 {return false;}
        if new_col < 0 || new_col >= grid[0].len() as i32 {return false;}

        search.0 = new_row;
        search.1 = new_col;

        let current_char = grid[search.0 as usize][search.1 as usize];
        if current_char != expected {return false;}

       expected = match expected {
           'M' => 'A',
           'A' => 'S',
           'S' => '*',
           _ => '.'
       };
    }
}

// PART 2
fn count_all_x_mas(grid: &CharGrid) -> i32
{
    let mut total = 0;
    let height = grid.len();
    let width = grid[0].len();

    // can count in 1 from edge for A's
    for r in 1..height - 1 {
        for c in 1..width - 1 {
            if grid[r][c] == 'A' && is_x_mas(grid, Point(r as i32,c as i32)) { total += 1 }
        }
    }

    total
}

fn is_x_mas(grid: &CharGrid, start: Point) -> bool
{
    let tlc = grid[(start.0 - 1) as usize][(start.1 - 1) as usize];
    let trc = grid[(start.0 - 1) as usize][(start.1 + 1) as usize];
    let blc = grid[(start.0 + 1) as usize][(start.1 - 1) as usize];
    let brc = grid[(start.0 + 1) as usize][(start.1 + 1) as usize];

    (tlc == 'M' && brc == 'S' || tlc == 'S' && brc == 'M')
    && (trc == 'M' && blc == 'S' || trc == 'S' && blc == 'M')
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
