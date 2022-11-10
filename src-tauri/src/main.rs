#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod menu;

fn main() {
    tauri::Builder::default()
        .menu(menu::create_menu())
        .on_menu_event(|event| {
            menu::handle_event_menu(&event);
        })
        .invoke_handler(tauri::generate_handler![commands::rename_file_or_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
