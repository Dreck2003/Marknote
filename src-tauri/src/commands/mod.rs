use std::{fs::rename, io::ErrorKind};

use serde::{Deserialize, Serialize};

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
