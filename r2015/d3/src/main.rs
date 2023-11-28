use std::collections::HashSet;
use std::fs;

fn main() {
    let input = fs::read_to_string("src/input.txt").expect("unable to read file");

    let mut p1_houses: HashSet<(i32, i32)> = HashSet::new();
    let mut p2_houses: HashSet<(i32, i32)> = HashSet::new();

    struct DeliveryAgent {
        name: String,
        pos: (i32, i32),
    }

    let mut p1_santa = DeliveryAgent {
        name: String::from("santa"),
        pos: (0, 0),
    };

    let mut p2_santa = DeliveryAgent {
        name: String::from("santa"),
        pos: (0, 0),
    };

    let mut p2_elf = DeliveryAgent {
        name: String::from("elf"),
        pos: (0, 0),
    };

    let mut p2_active_agent = &mut p2_santa;

    for mv in input.chars() {
        match mv {
            '^' => {
                p1_santa.pos.1 += 1;
                p2_active_agent.pos.1 += 1;
            }
            '>' => {
                p1_santa.pos.0 += 1;
                p2_active_agent.pos.0 += 1;
            }
            'v' => {
                p1_santa.pos.1 -= 1;
                p2_active_agent.pos.1 -= 1
            }
            '<' => {
                p1_santa.pos.0 -= 1;
                p2_active_agent.pos.0 -= 1;
            }
            _ => (),
        }

        // insert current delivery agent coordinates into set
        p1_houses.insert(p1_santa.pos);
        p2_houses.insert(p2_active_agent.pos);

        // toggle active agent
        p2_active_agent = match p2_active_agent.name.as_str() {
            "santa" => &mut p2_elf,
            "elf" => &mut p2_santa,
            _ => panic!("Invalid DeliveryAgent"),
        }
    }

    println!(
        "Number of houses visited at least once in p1: {}",
        p1_houses.len()
    );

    println!(
        "Number of houses visited at least once in p2: {}",
        p2_houses.len()
    );
}
