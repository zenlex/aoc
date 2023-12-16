use core::panic;
use std::{cmp::Ordering, error::Error};

use indexmap::IndexMap;

use crate::utils;

pub fn run() {
    println!("Running D...");
    println!("Part 1: {}", main("./inputs/d5.txt", 1).unwrap());
    println!("Part 2: {}", main("./inputs/d5.txt", 2).unwrap());
}

fn main(input: &str, part: usize) -> Result<usize, Box<dyn Error>> {
    // parse input into seeds and maps (take chunks, seeds are first, then maps in order)
    // for seed line, grab digits as groups inline after "seeds: "
    // for map lines, strip title line, then grab lines as map entries
    let mut lines = utils::read_lines(input)?.map(|l| l.unwrap());

    let seeds = lines.next().unwrap()[7..]
        .split(' ')
        .collect::<Vec<_>>()
        .iter()
        .map(|s| s.parse::<usize>().unwrap())
        .collect();

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

    let locations = almanac.get_locations(seeds, part);
    Ok(*locations.iter().min().unwrap())
}

type Seeds = Vec<usize>;
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

    fn get_seeds_from_ranges(input: Seeds) -> Seeds {
        let mut seeds = vec![];

        let mut i = 0;
        while i < input.len() {
            let start = input[i];
            let end = start + input[i + 1];
            seeds.extend(start..end);
            i += 2;
        }

        seeds
    }

    fn get_locations(&self, seeds: Seeds, part: usize) -> Locations {
        let seeds = match part {
            1 => seeds,
            2 => Self::get_seeds_from_ranges(seeds),
            _ => panic!("Invalid part"),
        };
        let soils = self.transform(seeds, &self.soil_map);
        let fertilizers = self.transform(soils, &self.fertilizer_map);
        let waters = self.transform(fertilizers, &self.water_map);
        let lights = self.transform(waters, &self.light_map);
        let temperatures = self.transform(lights, &self.temperature_map);
        let humidities = self.transform(temperatures, &self.humidity_map);
        self.transform(humidities, &self.location_map)
    }

    fn transform(&self, input: Vec<usize>, map: &Map) -> Vec<usize> {
        input
            .iter()
            .map(|item| match Self::get_offset(*item, map) {
                Offset::Pos(offset) => item + offset,
                Offset::Neg(offset) => item - offset,
            })
            .collect()
    }

    fn get_offset(needle: usize, haystack: &Map) -> Offset {
        let mut keys: Vec<_> = haystack.keys().collect();
        keys.sort();

        if keys.is_empty() {
            return Offset::Pos(0);
        }

        if needle < *keys[0] {
            return Offset::Pos(0);
        }

        if keys.len() < 3 {
            for i in 0..keys.len() {
                match needle < keys[i] + haystack[keys[i]].1 && needle >= *keys[i] {
                    true => return haystack[keys[i]].0,
                    false => (),
                }
            }
            return Offset::Pos(0);
        }

        let mut left = 0;
        let mut right = haystack.len() - 1;
        let mut pivot = (right + left) / 2;

        while right >= left {
            let key = keys[pivot];
            match key.cmp(&needle) {
                Ordering::Equal => return haystack.get(&needle).unwrap().0,
                Ordering::Less => left = pivot + 1,
                Ordering::Greater => {
                    right = match pivot.checked_sub(1) {
                        Some(v) => v,
                        None => break,
                    }
                }
            };
            pivot = (right + left) / 2;
        }

        let (_, range) = haystack.get(keys[pivot]).unwrap();
        match needle < keys[pivot] + range {
            true => haystack[keys[pivot]].0,
            false => Offset::Pos(0),
        }
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
        // assert_eq!(main("./inputs/d5.txt").unwrap(), 0);
    }

    #[test]
    fn test_get_offset() {
        let mut soil_map = IndexMap::new();
        soil_map.insert(50, (Offset::Pos(2), 48));
        soil_map.insert(98, (Offset::Neg(48), 2));
        let mut almanac = Almanac::new();
        std::mem::swap(&mut almanac.soil_map, &mut soil_map);
        assert_eq!(
            (almanac.transform(vec![98, 99], &almanac.soil_map)),
            vec![50, 51]
        );

        assert_eq!(Almanac::get_offset(50, &almanac.soil_map), Offset::Pos(2));
        assert_eq!(Almanac::get_offset(52, &almanac.soil_map), Offset::Pos(2));
        assert_eq!(Almanac::get_offset(99, &almanac.soil_map), Offset::Neg(48));
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
            (almanac.transform(vec![81, 14, 57, 13], &almanac.fertilizer_map)),
            vec![81, 53, 57, 52]
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
            (almanac.transform(vec![81, 53, 57, 52], &almanac.water_map)),
            vec![81, 49, 53, 41]
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
            (almanac.transform(vec![81, 49, 53, 41], &almanac.light_map)),
            vec![74, 42, 46, 34]
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
            (almanac.transform(vec![74, 42, 46, 34], &almanac.temperature_map)),
            vec![78, 42, 82, 34]
        );
    }
}
