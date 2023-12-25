use std::{
    cmp::{max, min},
    collections::HashMap,
    error::Error,
};

use crate::utils;

pub fn run() {
    println!("Running D7..");
    println!("Part 1: {}", main("./inputs/d7.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d7.txt").unwrap());
}

fn main(input: &str) -> Result<u32, Box<dyn Error>> {
    let mut hands: Vec<Hand> = utils::read_lines(input)?
        .map(|line| line.unwrap())
        .map(|line| {
            let mut split = line.split(' ');
            let hand = split.next().unwrap();
            let bid = split.next().unwrap().parse::<u32>().unwrap();
            Hand::new(hand, bid)
        })
        .collect();

    hands.sort();

    let score = hands
        .iter()
        .enumerate()
        .fold(0, |acc, (index, hand)| acc + hand.bid * (index as u32 + 1));

    Ok(score)
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
enum HandType {
    HighCard,
    OnePair,
    TwoPairs,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
}

type Card = u32;

#[derive(Debug, PartialEq, Eq)]
struct Hand {
    cards: Vec<Card>,
    bid: u32,
    hand_type: HandType,
}

impl Ord for Hand {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        match self.hand_type.cmp(&other.hand_type) {
            std::cmp::Ordering::Equal => {
                for (card1, card2) in self.cards.iter().zip(other.cards.iter()) {
                    match card1.cmp(card2) {
                        std::cmp::Ordering::Equal => continue,
                        std::cmp::Ordering::Greater => return std::cmp::Ordering::Greater,
                        std::cmp::Ordering::Less => return std::cmp::Ordering::Less,
                    }
                }
                std::cmp::Ordering::Equal
            }
            std::cmp::Ordering::Greater => std::cmp::Ordering::Greater,
            std::cmp::Ordering::Less => std::cmp::Ordering::Less,
        }
    }
}

impl PartialOrd for Hand {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Hand {
    pub fn new(input: &str, bid: u32) -> Self {
        let cards: Vec<Card> = input.chars().map(Self::get_numeric).collect();
        let hand_type = Self::get_hand_type(&cards);
        Hand {
            cards,
            bid,
            hand_type,
        }
    }

    fn get_numeric(input: char) -> Card {
        match input {
            'T' => 10,
            'J' => 11,
            'Q' => 12,
            'K' => 13,
            'A' => 14,
            _ => input.to_digit(10).unwrap(),
        }
    }

    fn get_hand_type(cards: &[Card]) -> HandType {
        let mut counts: HashMap<u32, u32> = HashMap::new();
        for card in cards.iter() {
            let count = counts.entry(*card).or_insert(0);
            *count += 1;
        }

        match counts.values().max().unwrap() {
            5 => HandType::FiveOfAKind,

            4 => HandType::FourOfAKind,
            3 => {
                if counts.len() == 2 {
                    HandType::FullHouse
                } else {
                    HandType::ThreeOfAKind
                }
            }
            2 => {
                if counts.len() == 3 {
                    HandType::TwoPairs
                } else {
                    HandType::OnePair
                }
            }
            _ => HandType::HighCard,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d7-ex1.txt").unwrap(), 6440);
        assert!(main("./inputs/d7.txt").unwrap() < 251437955);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d7-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d7.txt").unwrap(), 0);
    // }
}
