use std::{fs::rename, io::ErrorKind};

use serde::{Deserialize, Serialize};

use crate::parser::{get_blocks_lines::parse_lines, mark_from_lines};
#[derive(Serialize, Deserialize)]
pub struct RenameValue(bool, String);

#[tauri::command]
pub fn rename_file_or_folder(path: &str, new_path: &str) -> RenameValue {
    let result = rename(path, new_path);
    match result {
        Ok(_) => {
            return RenameValue(true, new_path.into());
        }
        Err(e) => {
            let kind = e.kind();
            match kind {
                ErrorKind::NotFound => {
                    return RenameValue(false, String::from("Not Found"));
                }
                _ => {
                    return RenameValue(false, String::from("An error ocurred"));
                }
            }
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct MarkdownText(String);

#[tauri::command]
pub fn convert_str_to_markdown(lines: Vec<&str>) -> MarkdownText {
    println!("lines: {:?}", lines);
    let type_lines = parse_lines(&lines);
    println!("type_lines: {:?}", type_lines);
    let markdown = mark_from_lines(type_lines);
    println!("markdown: {:?}", markdown);
    return MarkdownText(markdown);
}
