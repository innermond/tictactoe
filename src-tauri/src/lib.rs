// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
enum SquareValue {
    X,
    O,
}

type Squares = [Option<SquareValue>; 9];

#[tauri::command]
fn check_winner(squares: Squares) -> (Option<SquareValue>, Option<[usize; 3]>) {
    let winning = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for [x, y, z] in winning.iter() {
        if squares[*x].is_none() || squares[*y].is_none() || squares[*z].is_none() {
            continue;
        }
        if squares[*x] == squares[*y] && squares[*y] == squares[*z] {
            return (squares[*x], Some([*x, *y, *z]));
        }
    }
    (None, None)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, check_winner])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
