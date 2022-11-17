use super::types::TypeLine;

pub fn get_mark_title(line: &str) -> (String, TypeLine) {
    let clean_line = line.trim();
    let chars = clean_line.chars();
    let mut i = 0;
    let mut count_hash = 0;

    for char in chars {
        if count_hash > 6 {
            // If is more than 6 ==> <h6></h6>
            return (format!("<p>{}</p>", clean_line), TypeLine::Paragraph);
        }
        if char == '#' {
            if i - count_hash == 0 {
                //If is sequencial
                count_hash += 1;
            } else {
                return (format!("<p>{}</p>", clean_line), TypeLine::Paragraph);
            }
            i += 1;
            continue;
        }
        if char == ' ' && i - count_hash == 0 {
            return (
                format!("<h{count_hash}>{}</h{count_hash}>", &clean_line[i + 1..]),
                TypeLine::Title,
            );
        }
        if char != '#' {
            break;
        }
    }
    return (
        format!("<h{}>{}</h{}>", count_hash, &clean_line[i..], count_hash),
        TypeLine::Title,
    );
}

#[cfg(test)]
mod test_util {
    use crate::parse_markdown::types::TypeLine;

    use super::get_mark_title;

    #[test]
    fn test_mark_title() {
        let lines = vec![
            "  ### Title 3",
            "##No title",
            "####### No title",
            "##### Title 5",
        ];
        println!("{:?}", lines);
        let strs = lines
            .iter()
            .map(|l| get_mark_title(l))
            .collect::<Vec<(String, TypeLine)>>();
        println!("{:?}", strs);
        assert!(false);
    }
}
