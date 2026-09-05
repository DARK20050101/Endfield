use tauri_plugin_opener::OpenerExt;

const OFFICIAL_LOGIN_URL: &str = "https://user.hypergryph.com/";

// No user-controlled URL and no credentials cross this IPC boundary.
#[tauri::command]
fn open_official_login(app: tauri::AppHandle, window: tauri::Window) -> Result<(), &'static str> {
    if window.label() != "main" {
        return Err("UNAUTHORIZED_WINDOW");
    }
    app.opener()
        .open_url(OFFICIAL_LOGIN_URL, None::<&str>)
        .map_err(|_| "OPEN_FAILED")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_official_login])
        .run(tauri::generate_context!())
        .expect("application startup failed");
}
