use clap::Parser;
use anyhow::Result;
#[allow(unused)]
mod day1;
mod template;

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
       _ => panic!("day {} not implemented yet", day)
   }
   Ok(())
}
