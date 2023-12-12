use std::{
    cmp::{max, Ordering},
    error::Error,
};

use indexmap::IndexMap;

use crate::utils;

pub fn run() {
    println!("Running D...");
    println!("Part 1: {}", main("./inputs/d5.txt").unwrap());
    // println!("Part 2: {}", main("./inputs/d5.txt").unwrap());
}

fn main(input: &str) -> Result<usize, Box<dyn Error>> {
    Ok(0)
    // parse seed lines into a Vec<usize>.
    // parse map lines into a series of hash maps.
    // each hash map is keys that have an offset (start of a source range)
    // values are a tuple of (offset, range)
    // write a function for each map that takes the input and returns the output. Building them as a struct with a fluent api would be cool....
    // call the mapping chain for each seed in the seeds vec to get the vec of locations, then take the min
}

type Seeds = Vec<usize>;
type Soils = Vec<usize>;
type Fertilizers = Vec<usize>;
type Waters = Vec<usize>;
type Lights = Vec<usize>;
type Temperatures = Vec<usize>;
type Humidities = Vec<usize>;
type Locations = Vec<usize>;

#[derive(Debug, PartialEq, Clone, Copy)]
enum Offset {
    Pos(usize),
    Neg(usize),
}

type Map = IndexMap<usize, (Offset, usize)>;
struct GrowthChain {
    soil_map: Map,
    fertilizer_map: Map,
    water_map: Map,
    light_map: Map,
    temperature_map: Map,
    humidity_map: Map,
    location_map: Map,
}

impl GrowthChain {
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

    fn to_soils(&self, seeds: Seeds) -> Soils {
        seeds
            .iter()
            .map(|seed| match Self::get_offset(*seed, &self.soil_map) {
                Offset::Pos(offset) => seed + offset,
                Offset::Neg(offset) => seed - offset,
            })
            .collect()
    }

    fn to_fertilizers(&self, input: Soils) -> Fertilizers {
        input
    }

    fn to_waters(&self, input: Fertilizers) -> Waters {
        input
    }

    fn to_lights(&self, input: Waters) -> Lights {
        input
    }

    fn to_temperatures(&self, input: Lights) -> Temperatures {
        input
    }

    fn to_humidities(&self, input: Temperatures) -> Humidities {
        input
    }

    fn to_locations(&self, input: Humidities) -> Locations {
        input
    }

    fn get_offset(needle: usize, haystack: &Map) -> Offset {
        let mut left = 0;
        let mut right = haystack.len() - 1;
        let mut pivot = (right + left) / 2;
        let keys: Vec<_> = haystack.keys().collect();

        while right >= left {
            let key = keys[pivot];
            match key.cmp(&needle) {
                Ordering::Equal => return haystack.get(&needle).unwrap().0,
                Ordering::Less => left = pivot + 1,
                Ordering::Greater => right = pivot - 1,
            };
            pivot = (right + left) / 2;
        }

        assert!(keys[pivot] < &needle);
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
        assert_eq!(main("./inputs/d5-ex1.txt").unwrap(), 35);
        // assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    }

    // #[test]
    // fn test_part2() {
    //     assert_eq!(main("./inputs/d#-ex2.txt").unwrap(), 0);
    //     assert_eq!(main("./inputs/d#.txt").unwrap(), 0);
    // }

    #[test]
    fn test_get_offset() {
        let mut soil_map = IndexMap::new();
        soil_map.insert(50, (Offset::Pos(2), 48));
        soil_map.insert(98, (Offset::Neg(48), 2));
        let mut chain = GrowthChain::new();
        std::mem::swap(&mut chain.soil_map, &mut soil_map);
        assert_eq!(chain.to_soils(vec![98, 99]), vec![50, 51]);

        assert_eq!(
            GrowthChain::get_offset(50, &chain.soil_map),
            Offset::Neg(48)
        );
        assert_eq!(GrowthChain::get_offset(52, &chain.soil_map), Offset::Pos(2));
        assert_eq!(
            GrowthChain::get_offset(51, &chain.soil_map),
            Offset::Neg(48)
        );
    }
}
