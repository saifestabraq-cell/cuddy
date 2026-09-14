// Tauri application entry.
//
// In development the Python backend is started by the `beforeDevCommand`
// (`npm run dev` runs the API + Vite together), so we do NOT spawn it here.
//
// In a packaged release build, the backend is bundled as an external binary
// (`cuddy-backend`, produced by PyInstaller — see docs/architecture.md) and
// launched on startup as a Tauri sidecar. If it isn't present yet the app
// still opens and simply reports "Engine offline"/"failed to start" until the
// backend is reachable (the frontend's health poll drives that state).
//
// The spawned child is tracked in app state so it can be terminated when the
// window closes — otherwise a packaged app can leave an orphaned
// cuddy-backend.exe running after the user quits Cuddy.

use std::sync::Mutex;
use tauri::Manager;

/// Holds the sidecar's child-process handle so it can be killed on exit.
struct BackendProcess(Mutex<Option<tauri_plugin_shell::process::CommandChild>>);

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(BackendProcess(Mutex::new(None)))
        .setup(|_app| {
            #[cfg(not(debug_assertions))]
            {
                use tauri_plugin_shell::ShellExt;
                match _app.shell().sidecar("cuddy-backend") {
                    Ok(cmd) => match cmd.spawn() {
                        Ok((_rx, child)) => {
                            let state = _app.state::<BackendProcess>();
                            *state.0.lock().unwrap() = Some(child);
                        }
                        Err(err) => eprintln!("Failed to spawn Cuddy backend: {err}"),
                    },
                    Err(err) => eprintln!("Cuddy backend sidecar not configured: {err}"),
                }
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            // Terminate the backend child process when the main window closes,
            // so no cuddy-backend.exe is left running after Cuddy quits.
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let state = window.state::<BackendProcess>();
                let child = state.0.lock().unwrap().take();
                if let Some(child) = child {
                    let _ = child.kill();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Cuddy");
}
