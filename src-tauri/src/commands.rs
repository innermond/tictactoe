#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum SquareValue {
    X,
    O,
}

type Squares = [Option<SquareValue>; 9];

#[tauri::command]
pub fn check_winner(squares: Squares) -> (Option<SquareValue>, Option<[usize; 3]>) {
    use std::{thread, time};
    // blobs main thread
    thread::sleep(time::Duration::from_millis(1000));
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
