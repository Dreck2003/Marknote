use std::fmt::Debug;

use super::type_line::TypeList;

#[allow(dead_code)]
fn get_line_without_white_space(type_line: char, line: &str) -> String {
    let chars = line.chars();

    let mut i = 0;
    for letter in chars {
        i += 1;
        if letter == type_line {
            break;
        }
    }
    let rest = &line.chars().as_str()[i..];
    return rest.into();
}

#[allow(dead_code)]
pub fn get_first_letter(value: &str) -> (i32, char) {
    // println!("value {value}");
    let mut i = 0;
    for letter in value.chars() {
        if letter != ' ' {
            return (i, letter);
        }
        i += 1;
    }
    return (i, ' ');
}

#[allow(dead_code)]
pub fn get_mark_title(titles: Vec<String>) -> String {
    let title = &titles[0];
    let mut hash_count = 0;
    let mut rest = vec![];

    for letter in title.chars() {
        if letter == '#' {
            hash_count += 1;
            continue;
        }
        rest.push(letter);
    }

    return format!("<h{hash_count}>{}</h{hash_count}>", String::from_iter(rest));
}

#[allow(dead_code)]
pub fn get_mark_code<T>(codes: Vec<T>) -> String
where
    T: ToString,
{
    let code_line_values = codes.iter().fold("".to_string(), |acc, code_line| {
        format!("{acc} {}", &code_line.to_string()[4..])
    });

    return format!("<code>{code_line_values}</code>");
}

#[allow(dead_code)]
pub fn get_mark_blockquote<T>(codes: Vec<T>) -> String
where
    T: AsRef<str>,
{
    let code_line_values = codes.iter().fold("".to_string(), |acc, code_line| {
        let line = get_line_without_white_space('>', code_line.as_ref());
        format!("{acc} {line}")
    });

    return format!("<blockquote>{code_line_values}</blockquote>");
}

#[allow(dead_code)]
const WHITE_SPACES: u8 = 2;

#[allow(dead_code)]
pub fn get_mark_list<T>(list: &[T], type_list: TypeList, space_initial: i32) -> (i32, String)
where
    T: ToString + Debug,
{
    let mut string_v = String::from("<ul>"); // Init HtmlTag
    let mut i = 0; // This is for get line value
    let mut lap_count = 0;
    let mut is_initial = space_initial == 0;
    let mut spaces = space_initial;

    loop {
        let line = list.get(i);
        println!("is initial {is_initial} ,spaces {spaces}");
        match line {
            Some(val) => {
                let (index, _) = get_first_letter(&val.to_string());
                if is_initial {
                    spaces = index;
                    is_initial = false;
                }
                let line_value = get_line_without_white_space('-', &val.to_string());

                if spaces == index {
                    // If it is in the same position :
                    string_v.push_str(&format!("<li>{}</li>", line_value));
                    i += 1;
                    lap_count += 1;
                    continue;
                }

                if index > spaces {
                    // If the next index is greater than spaces
                    if index - spaces == 2 {
                        // If the diference is 2  then is a list
                        let ul = get_mark_list(&list[i..], type_list, spaces + WHITE_SPACES as i32);
                        string_v.push_str(&format!("<li>{}</li>", ul.1));
                        i += ul.0 as usize;
                        lap_count += 1;

                        continue;
                    }
                    // if not then is a normal paragraph
                    string_v.push_str(&format!("<p>{}</p>", val.to_string()));
                    i += 1;
                    lap_count += 1;
                }

                // If the index is less than spaces then is parent list
                break;
            }
            None => break,
        }
    }
    string_v.push_str("</ul>");
    return (lap_count as i32, string_v);
}

#[allow(dead_code)]
pub fn get_mark_paragrahp<T>(paragraphs: &[T]) -> String
where
    T: ToString,
{
    let mut value_s = String::from("<p>");

    for par in paragraphs {
        value_s.push_str(&par.to_string());
        value_s.push_str(" ");
    }
    value_s.push_str("</p>");
    return value_s;
}

#[cfg(test)]
mod pares_line_test {
    use super::*;

    #[test]
    fn test_mark_title() {
        let title = vec!["##### Titulo for others".to_string()];
        let result = get_mark_title(title);
        assert_eq!(result, "<h5> Titulo for others</h5>");
    }

    #[test]
    fn test_mark_paragraph() {
        let values = vec!["parrafo1", "parrafo2", "parrafo3"];
        let res = get_mark_paragrahp(&values);
        assert_eq!(res, "<p>parrafo1 parrafo2 parrafo3 </p>");
    }

    #[test]
    fn test_mark_code() {
        let lines = vec!["    block", "    other block"];
        let res = get_mark_code(lines);
        assert_eq!(res, "<code> block other block</code>");
    }

    #[test]
    fn test_mark_blockquote() {
        let rest_value = get_mark_blockquote(vec![">block", ">other block"]);
        assert_eq!(rest_value, "<blockquote> block other block</blockquote>");
    }

    #[test]
    fn test_mark_list() {
        let type_list = TypeList::Ordered;
        let list = vec!["- item1", "  - subItem1", "- item 3"];
        let list_string = list.iter().map(|v| v.to_string()).collect::<Vec<String>>();
        let res = get_mark_list(&list_string, type_list, 0);
        assert_eq!(
            res.1,
            "<ul><li> item1</li><li><ul><li> subItem1</li></ul></li><li> item 3</li></ul>"
        );
    }
    #[test]
    fn test_mark_list_2() {
        let list = vec![" - # list"];
        let rest = get_mark_list(&list, TypeList::Unordered, 0);
        assert_eq!(rest.1, "<ul><li> # list</li></ul>");
    }

    // #[test]
    // fn text_split_and_get_line() {
    //     let rest_value = get_line_without_white_space('-', "   - lista");
    //     assert_eq!(rest_value, " lista");
    // }
}
