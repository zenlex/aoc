use std::error::Error;

use crate::utils;

pub fn run() {
    println!("Running D...");
    println!("Part 1: {}", main("./inputs/d1.txt").unwrap());
    println!("Part 2: {}", main("./inputs/d1.txt").unwrap());
}

fn main(input: &str) -> Result<i32, Box<dyn Error>> {}
