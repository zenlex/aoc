use core::panic;
use std::{
    cmp::{max, min, Ordering},
    error::Error,
};

use indexmap::IndexMap;

use crate::utils;

pub fn run() {
    println!("Running D5..");
    println!("Part 1: {}", main("./inputs/d5.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d5.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<usize, Box<dyn Error>> {
    let mut lines = utils::read_lines(input)?.map(|l| l.unwrap());

    let seeds = Almanac::get_seed_ranges(&lines.next().unwrap()[7..], part);

    let maps = [
        "seed-to-soil",
        "soil-to-fertilizer",
        "fertilizer-to-water",
        "water-to-light",
        "light-to-temperature",
        "temperature-to-humidity",
        "humidity-to-location",
    ];

    let mut almanac = Almanac::new();

    for mut i in 0..maps.len() {
        while let Some(line) = lines.next() {
            if line.contains(maps[i]) {
                while let Some(line) = lines.next() {
                    if line.is_empty() {
                        i += 1;
                        break;
                    }
                    let mut parts = line.split(' ');
                    let destination = parts.next().unwrap().parse::<usize>().unwrap();
                    let source = parts.next().unwrap().parse::<usize>().unwrap();
                    let range = parts.next().unwrap().parse::<usize>().unwrap();
                    let offset = match source.cmp(&destination) {
                        Ordering::Less => Offset::Pos(destination - source),
                        Ordering::Equal => Offset::Pos(0),
                        Ordering::Greater => Offset::Neg(source - destination),
                    };
                    match i {
                        0 => almanac.soil_map.insert(source, (offset, range)),
                        1 => almanac.fertilizer_map.insert(source, (offset, range)),
                        2 => almanac.water_map.insert(source, (offset, range)),
                        3 => almanac.light_map.insert(source, (offset, range)),
                        4 => almanac.temperature_map.insert(source, (offset, range)),
                        5 => almanac.humidity_map.insert(source, (offset, range)),
                        6 => almanac.location_map.insert(source, (offset, range)),
                        _ => panic!("Invalid map index"),
                    };
                }
            }
        }
    }

    let locations = almanac.get_locations(seeds);
    Ok(*locations.iter().min().unwrap())
}

type Seeds = Vec<(usize, usize)>;
type Locations = Vec<usize>;

#[derive(Debug, PartialEq, Clone, Copy)]
enum Offset {
    Pos(usize),
    Neg(usize),
}

type Map = IndexMap<usize, (Offset, usize)>;
struct Almanac {
    soil_map: Map,
    fertilizer_map: Map,
    water_map: Map,
    light_map: Map,
    temperature_map: Map,
    humidity_map: Map,
    location_map: Map,
}

impl Almanac {
    fn new() -> Self {
        Self {
            soil_map: IndexMap::new(),
            fertilizer_map: IndexMap::new(),
            water_map: IndexMap::new(),
            light_map: IndexMap::new(),
            temperature_map: IndexMap::new(),
            humidity_map: IndexMap::new(),
            location_map: IndexMap::new(),
        }
    }

    fn get_seed_ranges(input: &str, part: usize) -> Vec<(usize, usize)> {
        let values: Vec<usize> = input
            .split(' ')
            .collect::<Vec<_>>()
            .iter()
            .map(|s| s.parse::<usize>().unwrap())
            .collect();

        let mut seeds = vec![];

        let mut i = 0;
        while i < values.len() {
            let start = values[i];
            let end;
            match part {
                1 => {
                    end = start;
                    i += 1
                }
                2 => {
                    end = start + values[i + 1] - 1;
                    i += 2
                }
                _ => panic!("Invalid part"),
            };
            seeds.push((start, end));
        }

        seeds
    }

    fn get_locations(&self, seeds: Seeds) -> Locations {
        let soils = self.transform(seeds, &self.soil_map);
        let fertilizers = self.transform(soils, &self.fertilizer_map);
        let waters = self.transform(fertilizers, &self.water_map);
        let lights = self.transform(waters, &self.light_map);
        let temperatures = self.transform(lights, &self.temperature_map);
        let humidities = self.transform(temperatures, &self.humidity_map);
        self.transform(humidities, &self.location_map)
            .iter()
            .map(|item| item.0)
            .collect()
    }

    fn transform(&self, input: Vec<(usize, usize)>, map: &Map) -> Vec<(usize, usize)> {
        // add new range to output for each split
        let mut keys = map.keys().collect::<Vec<_>>();
        keys.sort();

        let mut output = vec![];
        for (start, end) in input {
            let mut index = start;
            if start < *keys[0] {
                let new_end = min(end, *keys[0] - 1);
                output.push((start, new_end));
                index = new_end + 1;
            }

            let neighbors = Self::get_neighbors(start, &keys);

            if let Some(key) = neighbors.0 {
                let (offset, range) = map.get(&key).unwrap();
                while index < key + range && index <= end {
                    let new_start = index;
                    let new_end = if end < key + range {
                        end
                    } else {
                        key + range - 1
                    };
                    index = max(new_end, key + range);

                    let offset_start = match offset {
                        Offset::Pos(v) => new_start + v,
                        Offset::Neg(v) => new_start - v,
                    };

                    let offset_end = match offset {
                        Offset::Pos(v) => new_end + v,
                        Offset::Neg(v) => new_end - v,
                    };

                    output.push((offset_start, offset_end));
                }
            }

            match neighbors.1 {
                Some(key) => {
                    let (offset, range) = map.get(&key).unwrap();
                    while index >= key && index < key + range && index <= end {
                        let new_start = index;
                        let new_end = if end < key + range {
                            end
                        } else {
                            key + range - 1
                        };
                        index = max(new_end, key + range);

                        let offset_start = match offset {
                            Offset::Pos(v) => new_start + v,
                            Offset::Neg(v) => new_start - v,
                        };

                        let offset_end = match offset {
                            Offset::Pos(v) => new_end + v,
                            Offset::Neg(v) => new_end - v,
                        };

                        output.push((offset_start, offset_end));
                    }
                }
                None => {
                    if index <= end {
                        output.push((index, end));
                    }
                }
            };

            // look at rest of sorted keys and see if there's anything left in index
            let key_index = keys.iter().position(|&k| k >= &index);
            keys.iter()
                .skip(key_index.unwrap_or(keys.len()))
                .for_each(|key| {
                    if *key > &end {
                        return;
                    }
                    let (offset, range) = map.get(*key).unwrap();
                    while index < *key + range && index <= end {
                        let new_start = index;
                        let new_end = if end < *key + range {
                            end
                        } else {
                            *key + range - 1
                        };
                        index = max(new_end, *key + range);

                        let offset_start = match offset {
                            Offset::Pos(v) => new_start + v,
                            Offset::Neg(v) => new_start - v,
                        };

                        let offset_end = match offset {
                            Offset::Pos(v) => new_end + v,
                            Offset::Neg(v) => new_end - v,
                        };

                        output.push((offset_start, offset_end));
                    }
                })
        }
        output
    }

    fn get_neighbors(needle: usize, haystack: &Vec<&usize>) -> (Option<usize>, Option<usize>) {
        if haystack.is_empty() {
            panic!("No keys to search in map");
        }

        if haystack.len() == 1 {
            match needle.cmp(haystack[0]) {
                Ordering::Less => return (None, Some(*haystack[0])),
                _ => return (Some(*haystack[0]), None),
            }
        }

        if haystack.len() == 2 {
            match needle.cmp(haystack[0]) {
                Ordering::Less => return (None, Some(*haystack[0])),
                Ordering::Equal => return (Some(*haystack[0]), Some(*haystack[1])),
                Ordering::Greater => match needle.cmp(haystack[1]) {
                    Ordering::Less => return (Some(*haystack[0]), Some(*haystack[1])),
                    Ordering::Equal => return (Some(*haystack[1]), None),
                    Ordering::Greater => return (Some(*haystack[1]), None),
                },
            }
        }

        let mut left = 0;
        let mut right = haystack.len() - 1;
        let mut pivot = (right + left) / 2;

        let lower;
        let upper;

        while right >= left {
            let key = haystack[pivot];
            match key.cmp(&needle) {
                Ordering::Equal => {
                    lower = Some(key);
                    upper = match pivot + 1 < haystack.len() {
                        true => Some(haystack[pivot + 1]),
                        false => None,
                    };
                    return (lower.copied(), upper.copied());
                }
                Ordering::Less => left = pivot + 1,
                Ordering::Greater => {
                    right = match pivot.checked_sub(1) {
                        Some(v) => v,
                        None => return (None, Some(*haystack[0])),
                    }
                }
            };
            pivot = (right + left) / 2;
        }

        match needle.cmp(haystack[pivot]) {
            Ordering::Less => match pivot.checked_sub(1) {
                Some(v) => {
                    lower = Some(haystack[v]);
                    upper = Some(haystack[pivot]);
                }
                None => {
                    lower = None;
                    upper = None;
                }
            },
            Ordering::Greater => {
                lower = Some(haystack[pivot]);
                upper = match pivot + 1 < haystack.len() {
                    true => Some(haystack[pivot + 1]),
                    false => None,
                };
            }
            _ => panic!("Invalid pivot"),
        };

        (lower.copied(), upper.copied())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(main("./inputs/d5-ex1.txt", 1).unwrap(), 35);
        assert_eq!(main("./inputs/d5.txt", 1).unwrap(), 331445006);
    }

    #[test]
    fn test_part2() {
        assert_eq!(main("./inputs/d5-ex1.txt", 2).unwrap(), 46);
        assert!(main("./inputs/d5.txt", 2).unwrap() < 24092691);
        // assert_eq!(main("./inputs/d5.txt", 2).unwrap(), 0);
    }

    #[test]
    fn test_seed_ranges() {
        assert_eq!(
            Almanac::get_seed_ranges("79 14 55 13", 2),
            vec![(79, 92), (55, 67)]
        );
    }

    #[test]
    fn get_soils() {
        let mut soil_map = IndexMap::new();
        soil_map.insert(98, (Offset::Neg(48), 2));
        soil_map.insert(50, (Offset::Pos(2), 48));
        let mut almanac = Almanac::new();
        std::mem::swap(&mut almanac.soil_map, &mut soil_map);
        // part 1
        assert_eq!(
            (almanac.transform(
                vec![(79, 79), (14, 14), (57, 57), (13, 13)],
                &almanac.soil_map
            )),
            vec![(81, 81), (14, 14), (59, 59), (13, 13)]
        );

        // part 2
        assert_eq!(
            (almanac.transform(vec![(79, 92), (55, 67)], &almanac.soil_map)),
            vec![(81, 94), (57, 69)]
        );
        assert_eq!(
            (almanac.transform(vec![(97, 99)], &almanac.soil_map)),
            vec![(99, 99), (50, 51)]
        );

        assert_eq!(
            (almanac.transform(vec![(0, 99)], &almanac.soil_map)),
            vec![(0, 49), (52, 99), (50, 51)]
        );

        assert_eq!(
            (almanac.transform(vec![(49, 51), (96, 97), (98, 99)], &almanac.soil_map)),
            vec![(49, 49), (52, 53), (98, 99), (50, 51)]
        );

        assert_eq!(
            (almanac.transform(vec![(0, 10), (12, 20)], &almanac.soil_map)),
            vec![(0, 10), (12, 20)]
        );
    }

    #[test]
    fn get_fertilizers() {
        let mut fertilizer_map = IndexMap::new();
        fertilizer_map.insert(15, (Offset::Neg(15), 37));
        fertilizer_map.insert(52, (Offset::Neg(15), 2));
        fertilizer_map.insert(0, (Offset::Pos(39), 15));
        let mut almanac = Almanac::new();
        std::mem::swap(&mut almanac.fertilizer_map, &mut fertilizer_map);
        assert_eq!(
            (almanac.transform(
                vec![(81, 81), (14, 14), (57, 57), (13, 13)],
                &almanac.fertilizer_map
            )),
            vec![(81, 81), (53, 53), (57, 57), (52, 52)]
        );
    }

    #[test]
    fn get_waters() {
        let mut water_map = IndexMap::new();
        water_map.insert(53, (Offset::Neg(4), 8));
        water_map.insert(11, (Offset::Neg(11), 42));
        water_map.insert(0, (Offset::Pos(42), 7));
        water_map.insert(7, (Offset::Pos(50), 4));
        let mut almanac = Almanac::new();
        std::mem::swap(&mut almanac.water_map, &mut water_map);
        assert_eq!(
            (almanac.transform(
                vec![(81, 81), (53, 53), (57, 57), (52, 52)],
                &almanac.water_map
            )),
            vec![(81, 81), (49, 49), (53, 53), (41, 41)]
        );
    }

    #[test]
    fn get_lights() {
        let mut light_map = IndexMap::new();
        light_map.insert(18, (Offset::Pos(70), 7));
        light_map.insert(25, (Offset::Neg(7), 70));
        let mut almanac = Almanac::new();
        std::mem::swap(&mut almanac.light_map, &mut light_map);
        assert_eq!(
            (almanac.transform(
                vec![(81, 81), (49, 49), (53, 53), (41, 41)],
                &almanac.light_map
            )),
            vec![(74, 74), (42, 42), (46, 46), (34, 34)]
        );
    }

    #[test]
    fn get_temperatures() {
        let mut temperature_map = IndexMap::new();
        temperature_map.insert(77, (Offset::Neg(32), 23));
        temperature_map.insert(45, (Offset::Pos(36), 19));
        temperature_map.insert(64, (Offset::Pos(4), 13));
        let mut almanac = Almanac::new();
        std::mem::swap(&mut almanac.temperature_map, &mut temperature_map);
        assert_eq!(
            (almanac.transform(
                vec![(74, 74), (42, 42), (46, 46), (34, 34)],
                &almanac.temperature_map
            )),
            vec![(78, 78), (42, 42), (82, 82), (34, 34)]
        );
    }
}
