use std::fs;

struct Present {
    h: u32,
    w: u32,
    d: u32,
}

impl Present {
    fn area(&self) -> u32 {
        (self.h * self.w * 2) + (self.h * self.d * 2) + (self.w * self.d * 2)
    }

    fn smallest_side_area(&self) -> u32 {
        let mut ordered_dims = [self.h, self.w, self.d];
        ordered_dims.sort();
        ordered_dims[0] * ordered_dims[1]
    }

    fn ribbon_wrap_length(&self) -> u32 {
        let mut ordered_dims = [self.h, self.w, self.d];
        ordered_dims.sort();
        2 * ordered_dims[0] + 2 * ordered_dims[1]
    }

    fn bow_length(&self) -> u32 {
        self.h * self.w * self.d
    }
}
fn main() {
    let raw_input = fs::read_to_string("src/input.txt").expect("unable to read file");

    let input = raw_input.trim();

    let lines: Vec<&str> = input.split("\n").collect();

    let mut total_area = 0;
    let mut total_ribbon = 0;

    for line in lines {
        let dimensions: Vec<u32> = line
            .split("x")
            .map(|val| val.parse::<u32>().expect("dimension not numeric"))
            .collect();

        let present = Present {
            h: dimensions[0],
            w: dimensions[1],
            d: dimensions[2],
        };

        total_area += present.area() + present.smallest_side_area();
        total_ribbon += present.ribbon_wrap_length() + present.bow_length();
    }

    println!("Total paper needed: {total_area}");
    println!("Total ribbon needed: {total_ribbon}");
}
