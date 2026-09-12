// Tauri application entry.
//
// In development the Python sidecar is started by the `beforeDevCommand`
// (`npm run dev` runs the API + Vite together), so we do NOT spawn it here.
//
// In a packaged release build, the sidecar is bundled as an external binary
// (`fa-sidecar`, produced by PyInstaller — see docs/architecture.md) and
// launched on startup. If it isn't present yet the app still opens and simply
// reports "Engine offline" until the backend is reachable.

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|_app| {
            #[cfg(not(debug_assertions))]
            {
                use tauri_plugin_shell::ShellExt;
                match _app.shell().sidecar("fa-sidecar") {
                    Ok(cmd) => {
                        if let Err(err) = cmd.spawn() {
                            eprintln!("Failed to spawn sidecar: {err}");
                        }
                    }
                    Err(err) => eprintln!("Sidecar not configured: {err}"),
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
