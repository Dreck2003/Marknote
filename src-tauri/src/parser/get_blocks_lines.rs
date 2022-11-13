use super::type_line::TypeLine;

fn get_type_line(line: &str) -> TypeLine {
    let chars = line.chars();

    if line.is_empty() {
        return TypeLine::LineBreak;
    }

    let mut spaces = 0;
    let mut hashes = 0;

    for char in chars {
        if char == ' ' {
            spaces += 1;
            if hashes < 7 && hashes > 0 {
                return TypeLine::Title;
            }

            if spaces >= 4 {
                return TypeLine::Code;
            }
        }

        if char == '#' {
            hashes += 1;
            if hashes > 6 {
                return TypeLine::Paragraph;
            }
        }

        match char {
            '>' => {
                return TypeLine::BlockQuote;
            }
            '-' | '*' | '+' => {
                return TypeLine::List;
            }
            _ => {
                if char == ' ' || char == '#' {
                    continue;
                }
                return TypeLine::Paragraph;
            }
        }
    }

    if hashes < 7 && hashes > 0 {
        return TypeLine::Title;
    }

    return TypeLine::Paragraph;
}

fn equals_lines(lines: &[&str], initial_type: &TypeLine) -> Vec<String> {
    let mut lines_group: Vec<String> = vec![];

    let mut i = 0;
    loop {
        let line = lines.get(i as usize);

        i += 1;
        match line {
            Some(line_value) => {
                let result = get_type_line(line_value);

                if result != *initial_type {
                    break;
                }

                lines_group.push(line_value.to_string());
                continue;
            }
            None => break,
        }
    }

    return lines_group;
}

pub fn parse_lines(lines: &[&str]) -> Vec<(TypeLine, Vec<String>)> {
    let mut i = 0;
    let mut group_lines: Vec<(TypeLine, Vec<String>)> = vec![];

    loop {
        let line = lines.get(i);
        match line {
            Some(line_value) => {
                let type_line = get_type_line(line_value);
                match type_line {
                    TypeLine::Title => {
                        group_lines.push((type_line, vec![line_value.to_string()]));
                    }
                    TypeLine::LineBreak => {
                        group_lines.push((type_line, vec![line_value.to_string()]));
                    }
                    _ => {
                        let lines_group = equals_lines(&lines[i..], &type_line);
                        i += lines_group.len() as usize;
                        group_lines.push((type_line, lines_group));
                        continue;
                    }
                }
            }
            None => {
                break;
            }
        }
        i += 1;
    }

    return group_lines;
}

// #[cfg(test)]
// mod parse_test {
//     use super::*;

//     #[test]
//     fn algo() {
//         let lines = vec![
//             "# Title",
//             "  - list",
//             "####### parapagh",
//             " - # list",
//             ">block1",
//             ">block2",
//             ">block3",
//             "    code1",
//             "    code2",
//             "### title 3",
//             "    code3",
//         ];
//         println!("lines {:?}\n", lines);
//         let result = parse_lines(&lines);
//         println!("result: {:?}", result);
//         assert!(true)
//     }
// }
