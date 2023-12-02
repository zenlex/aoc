mod day1;
mod day2;

pub fn run() {
    day1::run();
    day2::run();
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
}

#[cfg(test)]
mod testing {
    pub type TestResult = Result<(), Box<dyn std::error::Error>>;
}
#[cfg(test)]
mod tests {}
