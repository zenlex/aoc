use std::error::Error;

use regex::Regex;

use crate::utils;

pub fn run() {
    println!("Running D2...");
    println!("Part 1: {}", main("./inputs/d2.txt", 1));
    println!("Part 2: {}", main("./inputs/d2.txt", 2));
}

fn main(input: &str, part: i32) -> i32 {
    let lines = utils::read_lines(input).unwrap().map(|line| line.unwrap());
    match part {
        1 => {
            let bounds = CubeGrab(12, 13, 14);
            lines.fold(0, |sum, line| {
                sum + match Game::create(&line, Some(&bounds)) {
                    Ok(game) => game.id,
                    Err(_) => 0,
                }
            })
        }
        2 => lines.fold(0, |power, line| {
            let game_power = Game::create(&line, None).unwrap().get_power();
            power + game_power
        }),
        _ => panic!("Invalid part"),
    }
}

#[derive(Debug, Clone)]
struct CubeGrab(i32, i32, i32);

impl CubeGrab {
    pub fn from_string(turn_string: &str) -> Result<CubeGrab, Box<dyn Error>> {
        let re = Regex::new(r"(\d+) (red|green|blue)").unwrap();
        let mut grab = CubeGrab(0, 0, 0);
        for cap in re.captures_iter(turn_string) {
            let val = cap.get(1).unwrap().as_str().parse()?;
            match cap.get(2).unwrap().as_str() {
                "red" => grab.0 = val,
                "green" => grab.1 = val,
                "blue" => grab.2 = val,
                _ => panic!("Invalid color"),
            }
        }
        Ok(grab)
    }
}

#[derive(Debug, Clone)]
struct Game {
    pub id: i32,
    pub turns: Vec<CubeGrab>,
}

impl Game {
    pub fn create(line: &str, bounds: Option<&CubeGrab>) -> Result<Game, Box<dyn Error>> {
        let id = Self::parse_id(line)?;
        let turns = Self::parse_turns(line)?;
        if let Some(bounds) = bounds {
            Self::validate_turns(&turns, bounds)?;
        }
        Ok(Game { id, turns })
    }

    pub fn get_power(&self) -> i32 {
        let min_cubes = self.get_min_cubes();
        min_cubes.0 * min_cubes.1 * min_cubes.2
    }

    fn validate_turns(turns: &[CubeGrab], bounds: &CubeGrab) -> Result<(), Box<dyn Error>> {
        match turns
            .iter()
            .any(|turn| turn.0 > bounds.0 || turn.1 > bounds.1 || turn.2 > bounds.2)
        {
            true => Err("Turns out of bounds".into()),
            false => Ok(()),
        }
    }

    fn parse_id(line: &str) -> Result<i32, Box<dyn Error>> {
        let re = Regex::new(r"\d+").unwrap();
        let result = re.find(line);
        match result {
            None => {
                panic!("No match found for line: {:?}", line);
            }
            Some(id) => match id.as_str().parse::<i32>() {
                Ok(id) => Ok(id),
                Err(e) => panic!("Unable to parse id: {:?}", e),
            },
        }
    }

    fn parse_turns(line: &str) -> Result<Vec<CubeGrab>, Box<dyn Error>> {
        let turns = line
            .split(':')
            .last()
            .expect("unable to parse turn strings")
            .split(';')
            .map(|turn| {
                CubeGrab::from_string(turn)
                    .unwrap_or_else(|turn| panic!("unable to parse turn string: {:?}", turn))
            })
            .collect();

        Ok(turns)
    }

    fn get_min_cubes(&self) -> CubeGrab {
        let mut maxes = CubeGrab(0, 0, 0);
        for turn in &self.turns {
            maxes.0 = turn.0.max(maxes.0);
            maxes.1 = turn.1.max(maxes.1);
            maxes.2 = turn.2.max(maxes.2);
        }

        maxes
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_all() {
        assert_eq!(main("./inputs/d2-ex1.txt", 1), 8);
        assert_eq!(main("./inputs/d2.txt", 1), 2505);
        assert_eq!(main("./inputs/d2-ex1.txt", 2), 2286);
        assert_eq!(main("./inputs/d2.txt", 2), 70265);
    }
}
