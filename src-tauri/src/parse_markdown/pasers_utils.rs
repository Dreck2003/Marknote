use super::{types::TypeLine, utils::get_mark_title};

fn get_type_line(line: &str) -> TypeLine {
    if line.is_empty() {
        return TypeLine::LineBreak;
    }
    let chars = line.chars();
    let mut white_lines = 0;

    for letter in chars {
        match letter {
            ' ' => {
                // If is empty and is more than 4
                white_lines += 1;
                if white_lines >= 4 {
                    return TypeLine::Code;
                }
            }
            '#' => return TypeLine::Title,
            '+' | '-' | '*' => return TypeLine::List,
            '>' => return TypeLine::BlockQuote,
            _ => return TypeLine::Paragraph,
        }
    }

    return TypeLine::Paragraph;
}

#[warn(dead_code)]
pub fn group_lines(lines: &[&str]) -> Vec<(TypeLine, String)> {
    let mut type_lines = vec![];

    for line in lines {
        type_lines.push((get_type_line(line), line.to_string()));
    }

    return type_lines;
}

fn match_type(tuple: &(TypeLine, String)) -> (String, TypeLine) {
    match tuple.0 {
        TypeLine::Title => get_mark_title(&tuple.1),
        TypeLine::BlockQuote => todo!(),
        TypeLine::Code => todo!(),
        TypeLine::List => todo!(),
        TypeLine::Paragraph => todo!(),
        TypeLine::LineBreak => todo!(),
    }
}

pub fn parse_by_types(lines: &[(TypeLine, String)]) -> String {
    if lines.len() == 0 {
        return "".into();
    }
    if lines.len() == 1 {
        return match_type(&lines[0]).0;
    }
    let result = match_type(&lines[0]);

    let mut string_s = String::from("");
    // let mut group_paragraphs: Vec<String> = vec![];
    // let mut group_list: Vec<String> = vec![];
    // let mut group_code: Vec<String> = vec![];
    let mut group_line: Vec<String> = vec![];
    // let mut group_paragraphs: Vec<String> = vec![];
    string_s.push_str(&result.0);

    let mut last_type = result.1;

    for line in lines[1..].iter() {
        let result = match_type(line);

        if last_type != result.1 {
            // Osea el ultimo tipo es diferente al actual
            // last: List | current: Title
            // SI son diferentes tenemos que añadir al string
            if last_type == TypeLine::Paragraph {
                string_s.push_str(&format!("<p>{}</p>", group_line.join(" ")));
            }
        }

        string_s.push_str(&result.0);
    }
    return string_s;
}

#[cfg(test)]
mod test_single_parse {

    use super::group_lines;

    #[test]
    fn test_get_group_lines() {
        let lines = vec!["#Title", "   ##Title2", "    codeLine", ">BLock", "  -list"];
        let type_lines = group_lines(&lines);
        println!("types: {:?}", type_lines);
        assert!(false);
    }
}
