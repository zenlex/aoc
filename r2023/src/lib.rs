mod day1;
mod day2;
mod day3;
mod day4;
mod day5;

pub fn run() {
    // day1::run();
    // day2::run();
    // day3::run();
    // day4::run();
    day5::run();
}
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
}

#[cfg(test)]
mod testing {
    pub type TestResult = Result<(), Box<dyn std::error::Error>>;
}
#[cfg(test)]
mod tests {}
