use std::fs;
fn main() {
    let input = fs::read_to_string("src/input.txt").expect("unable to read file");

    let mut floor = 0;
    let mut first_basement = -1;

    for (i, char) in input.chars().enumerate() {
        floor += match char {
            '(' => 1,
            ')' => -1,
            _ => 0,
        };

        if first_basement < 0 && floor == -1 {
            first_basement = i as isize + 1
        }
    }

    println!(
        "Resulting floor p1: {}, index for p2: {}",
        floor, first_basement
    );
}
