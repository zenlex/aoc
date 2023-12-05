use std::error::Error;

use regex::Regex;

use crate::utils;

pub fn run() {
    println!("Running D4..");
    println!("Part 1: {}", main("./inputs/d4.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d4.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<i32, Box<dyn Error>> {
    let mut cards: Vec<Card> = Vec::new();

    let lines = utils::read_lines(input)?.map(|x| x.unwrap());

    for (index, line) in lines.enumerate() {
        let re = Regex::new(r"((\d+)\s+)+.((\d+)\s?)+").unwrap();
        let caps: Vec<_> = re.find_iter(&line).map(|list| list.as_str()).collect();

        let spaces = Regex::new(r"\s+").unwrap();
        let winning: Vec<_> = spaces
            .split(caps[0].trim())
            .map(|x| x.parse::<usize>().unwrap())
            .collect();

        let held = spaces
            .split(caps[1].trim())
            .map(|x| x.parse::<usize>().unwrap())
            .collect();

        let card = Card {
            id: index + 1,
            winning,
            held,
            matches: 0,
        };

        cards.push(card);
    }

    cards.iter_mut().for_each(|card| card.count_matches());

    let mut total = 0;
    match part {
        1 => {
            let base: i32 = 2;
            for card in cards {
                if card.matches > 0 {
                    total += base.pow(card.matches as u32 - 1);
                }
            }
        }
        2 => {
            total = redeem_copies(&cards);
        }
        _ => panic!("Invalid part number"),
    }

    Ok(total)
}

fn redeem_copies(cards: &Vec<Card>) -> i32 {
    let mut card_counts = vec![1; cards.len() + 1];
    card_counts[0] = 0;

    for card in cards {
        let count = card_counts[card.id];
        for _ in 0..count {
            increment_counts(card, &mut card_counts)
        }
    }

    card_counts.iter().sum::<usize>() as i32
}

fn increment_counts(card: &Card, card_counts: &mut [usize]) {
    for count in card_counts.iter_mut().skip(card.id + 1).take(card.matches) {
        *count += 1;
    }
}

#[derive(Debug)]
struct Card {
    id: usize,
    winning: Vec<usize>,
    held: Vec<usize>,
    matches: usize,
}

impl Card {
    pub fn count_matches(&mut self) {
        if self.matches > 0 {
            return;
        }
        for winning in &self.winning {
            if self.held.contains(winning) {
                self.matches += 1;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d4-ex1.txt", 1).unwrap(), 13);
        assert_eq!(main("./inputs/d4.txt", 1).unwrap(), 21821);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d4-ex1.txt", 2).unwrap(), 30);
        assert_eq!(main("./inputs/d4.txt", 2).unwrap(), 5539496);
    }
}
