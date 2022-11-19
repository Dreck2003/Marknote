use std::{
    env::current_dir,
    fs::{self},
    io::Error,
};

#[cfg(windows)]
const LINE_ENDING: &'static str = "\r\n";
#[cfg(not(windows))]
const LINE_ENDING: &'static str = "\n";

#[warn(dead_code)]
const NAME_FOLDER: &str = "marknoteCache";

fn create_cache_folders() -> Result<(), Error> {
    let current = current_dir()?;
    let path_to_file = &format!("{}/{}/open-folders.txt", current.display(), NAME_FOLDER);
    fs::create_dir(&format!("{}/{}", current.display(), NAME_FOLDER))?;
    fs::File::create(path_to_file)?;
    return Ok(());
}

pub fn get_cache_file() -> Result<String, Error> {
    let current = current_dir()?;
    let path_to_file = &format!("{}/{}/open-folders.txt", current.display(), NAME_FOLDER);
    let result = fs::File::open(path_to_file);
    if let Ok(_) = result {
        let file_content = fs::read_to_string(path_to_file)?;
        return Ok(file_content);
    } else {
        create_cache_folders()?;
        let file_content = fs::read_to_string(path_to_file)?;
        return Ok(file_content);
    }
}

pub fn save_url(url: &str) {
    let current = current_dir().unwrap();
    let path_to_file = &format!("{}/{}/open-folders.txt", current.display(), NAME_FOLDER);
    let result = get_cache_file();
    if let Ok(st) = result {
        // Si se encontro el archivo cache,then:
        let join = st
            .lines()
            .filter(|l| {
                println!("l {}", l);
                return l != &url;
            })
            .collect::<Vec<&str>>()
            .join(LINE_ENDING);
        let _ = fs::write(path_to_file, format!("{}{LINE_ENDING}{}", url, join));
    }
}

pub fn create_or_get_cache_info() -> Option<String> {
    let result = get_cache_file();

    match result {
        Ok(val) => {
            if let Some(v) = val.lines().collect::<Vec<&str>>().get(0) {
                return Some(v.to_string());
            }
            return None;
        }
        Err(_) => None,
    }
}

#[cfg(test)]
mod test_files {
    // use super::save_url;

    // #[test]
    // fn test_cache_folder() {
    //     let result = create_cache_folders();
    //     println!("{:?}", result);
    //     assert!(false)
    // }
}
