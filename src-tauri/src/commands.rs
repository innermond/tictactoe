use tauri::Emitter;

#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum SquareValue {
    X,
    O,
}

type Squares = [Option<SquareValue>; 9];

type WinnerPayload = (Option<SquareValue>, Option<[usize; 3]>);

//#[tauri::command]
//pub fn check_winner(squares: Squares) -> WinnerPayload {
//    use std::time;
//    // bloks main thread that also handles the webview thread
//    std::thread::sleep(std::time::Duration::from_millis(300));
//    let winning = [
//        [0, 1, 2],
//        [3, 4, 5],
//        [6, 7, 8],
//        [0, 3, 6],
//        [1, 4, 7],
//        [2, 5, 8],
//        [0, 4, 8],
//        [2, 4, 6],
//    ];
//
//    for [x, y, z] in winning.iter() {
//        if squares[*x].is_none() || squares[*y].is_none() || squares[*z].is_none() {
//            continue;
//        }
//        if squares[*x] == squares[*y] && squares[*y] == squares[*z] {
//            return (squares[*x], Some([*x, *y, *z]));
//        }
//    }
//    (None, None)
//}

#[tauri::command]
pub async fn check_winner(squares: Squares, app: tauri::AppHandle) {
    //let squares = squares.clone();
    // Supposed to be CPU intensive
    tokio::task::spawn_blocking(move || {
        // CPU wasted time here
        std::thread::sleep(std::time::Duration::from_millis(300));
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
                app.emit::<WinnerPayload>("winner-checked", (squares[*x], Some([*x, *y, *z])))
                    .unwrap();
            }
        }
        app.emit::<WinnerPayload>("winner-checked", (None, None))
            .unwrap();
    });
}
