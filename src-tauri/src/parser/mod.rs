use crate::parser::{
    parse_line::{
        get_mark_blockquote, get_mark_code, get_mark_list, get_mark_paragrahp, get_mark_title,
    },
    type_line::{TypeLine, TypeList},
};
pub mod get_blocks_lines;
pub mod parse_line;
mod parse_single_line;
pub mod type_line;

#[allow(dead_code)]
pub fn mark_from_lines(group_lines: Vec<(TypeLine, Vec<String>)>) -> String {
    let mut string_v = String::from("");

    for (type_list, line_list) in group_lines {
        match type_list {
            TypeLine::Title => {
                let res = get_mark_title(line_list);
                string_v.push_str(&res);
            }
            TypeLine::BlockQuote => {
                let res = get_mark_blockquote(line_list);
                string_v.push_str(&res);
            }
            TypeLine::Code => {
                let res = get_mark_code(line_list);
                string_v.push_str(&res);
            }
            TypeLine::List => {
                let list = get_mark_list(&line_list, TypeList::Unordered, 0);
                string_v.push_str(&list.1);
            }
            TypeLine::Paragraph => {
                let p = get_mark_paragrahp(&line_list);
                string_v.push_str(&p);
            }
            TypeLine::LineBreak => {
                string_v.push_str("");
            }
        }
    }

    return string_v;
}

// #[cfg(test)]
mod markdow_test {

    use crate::parser::get_blocks_lines::parse_lines;

    use super::mark_from_lines;

    #[test]
    fn working() {
        let lines = vec![
            "# Title",
            "- list-1",
            "  - sub-list-1",
            "  - sub-list-2",
            "- list-2",
            "####### parapagh",
            " - # list",
            ">block1",
            ">block2",
            ">block3",
            "    code1",
            "    code2",
            "### title 3",
            "    code3",
        ];
        let group_lines = parse_lines(&lines);

        let res = mark_from_lines(group_lines);
        assert!(!res.is_empty());
    }
}
