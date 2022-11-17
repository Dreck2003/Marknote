use tauri::{CustomMenuItem, Menu, Submenu, WindowMenuEvent};

pub struct MenuFileKeys {
    pub new_file: String,
    pub open_file: String,
    pub open_folder: String,
}
impl MenuFileKeys {
    fn new() -> Self {
        Self {
            new_file: "new_file".to_string(),
            open_file: "open_file".to_string(),
            open_folder: "open_folder".to_string(),
        }
    }
}

struct CustomMenuFile {}

impl CustomMenuFile {
    fn create() -> Vec<CustomMenuItem> {
        let init_file_menu = MenuFileKeys::new();
        vec![
            // CustomMenuItem::new(init_file_menu.new_file, "New File"),
            // CustomMenuItem::new(init_file_menu.open_file, "Open File"),
            CustomMenuItem::new(init_file_menu.open_folder, "Open Folder"),
        ]
    }
}

pub fn create_menu() -> Menu {
    // Menu Item for "File" section:
    let files_submenu = CustomMenuFile::create();

    // "File" section
    let mut files_menu = Menu::new();

    // Fill "File" section
    for custom_menu in files_submenu {
        files_menu = files_menu.add_item(custom_menu);
    }

    // Create Submenu for "File" setion
    let sub_menu_file = Submenu::new("File", files_menu);
    Menu::new().add_submenu(sub_menu_file)
}

pub fn handle_event_menu(event: &WindowMenuEvent) {
    match event.menu_item_id() {
        "new_file" => {
            // event.window().emit("new-file", "New File");
        }
        "open_file" => {
            // event.window().emit("open-file", "Open File");
        }
        "open_folder" => {
            event.window().emit("open-folder", "Open Folder");
        }
        _ => {
            println!("Exist error");
            // todo!()
        }
    }
}
