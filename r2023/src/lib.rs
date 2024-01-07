mod day1;
mod day10;
mod day11;
mod day2;
mod day3;
mod day4;
mod day5;
mod day6;
mod day7;
mod day8;
mod day9;

pub fn run() {
    // day1::run();
    // day2::run();
    // day3::run();
    // day4::run();
    // day5::run();
    // day6::run();
    // day7::run();
    // day8::run();
    // day9::run();
    // day10::run();
    day11::run();
}

#[allow(dead_code)]
mod utils {

    use std::fmt::Debug;
    use std::fs::File;
    use std::io::{self, BufRead};
    use std::path::Path;

    pub fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
    where
        P: AsRef<Path> + Debug,
    {
        let file = File::open(filename)?;
        Ok(io::BufReader::new(file).lines())
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
}

#[cfg(test)]
mod testing {
    pub type TestResult = Result<(), Box<dyn std::error::Error>>;
}
#[cfg(test)]
mod tests {}
