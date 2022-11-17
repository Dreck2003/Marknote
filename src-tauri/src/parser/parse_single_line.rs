// fn run_str<T>(line: &str, clsure: T)
// where
//     T: FnMut(),
// {
//     let mut i = 0;

//     loop {
//         i += 1;
//     }
// }

#[warn(dead_code)]
pub fn get_part_asterisk(part_line: &str, count_asterisk: &u8) -> (i32, String) {
    let mut last_asterisk = 0;
    let mut index = 0;
    let mut count_final_asterisk = 0;
    let chars: Vec<char> = part_line.chars().collect();

    while let Some(letter) = chars.get(index) {
        if index == 0 && *letter != ' ' {
            return (0, "".into()); // Exist a whitespace, then not is bold
        }

        if *letter == '*' {
            // If this is first '*'
            if last_asterisk == 0 {
                last_asterisk = index;
            } else if index - last_asterisk <= 1 {
                last_asterisk = index;
            } else {
                break;
            }
        }

        index += 1;
    }

    return (*count_asterisk as i32, part_line.into());
}

#[warn(dead_code)]
pub fn get_count_of_asterisks(part_line: &str) -> u8 {
    let chars = part_line.chars();
    let mut i = 0;
    let mut last_index = 0;
    let mut count_asterisks = 0;

    for letter in chars {
        if letter != '*' {
            break;
        }

        last_index += 1;
        if i - last_index == 0 {
            count_asterisks += 1;
        }

        i += 1;
    }
    return count_asterisks;
}

fn fill_loop(num: u32, text: &str) -> String {
    let mut i = 0;
    let mut val = String::from("");

    while i <= num {
        val.push_str(text);
    }

    val
}

// pub fn parse_single_line(line: &str) -> String {
//     let mut i = 0;
//     let chars: Vec<char> = line.chars().collect();
//     let mut line_text = String::from("");
//     loop {
//         let letter = chars.get(i);

//         if let None = letter {
//             break; // If not have more letters, then close loop
//         }
//         if let Some(char) = letter {
//             if *char == '*' {
//                 // If the letter is asterisk, add 1 to count
//                 let mut asterisks = get_count_of_asterisks(&line[i..]);

//                 if asterisks > 3 {
//                     line_text.push_str(&fill_loop((asterisks - 3) as u32, "*"));
//                     asterisks = asterisks - 3;
//                 }
//                 let result = get_part_asterisk(part_line, count_asterisk);

//                 i += asterisks as usize;
//                 // count_asterisk += 1;
//             }
//         }
//         i += 1;
//     }

//     return "".into();
// }
