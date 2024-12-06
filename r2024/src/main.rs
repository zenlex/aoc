use clap::Parser;
use anyhow::Result;
mod day1;
mod day2;
mod day3;
mod template;
mod day4;
mod day5;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long)]
    day: u8
}

fn main() {
    let args = Args::parse();
    run_day(args.day).unwrap();
}

fn run_day(day: u8) -> Result<()>{
   match day {
       1 => day1::run(),
       2 => day2::run(),
       3 => day3::run(),
       4 => day4::run(),
       5 => day5::run(),
       _ => panic!("day {} not implemented yet", day)
   }
   Ok(())
}
