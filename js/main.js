/*--- constants ---*/

const symbols = {
    0: '',
    1: 'X',
    '-1': 'O'
}

const boardIds = [
    ['top left', 'top middle', 'top right'],
    ['center left', 'center middle', 'center right'],
    ['bottom left', 'bottom middle', 'bottom right']
];

/*--- state variables ---*/

let board;
let turn;
let winner;

/*--- cached elements ---*/

const messageEl = document.getElementById('message');
const playAgainButton = document.querySelector('button');

/*--- functions ---*/

init();

function init() {
    turn = 1;
    winner = null;
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    render();
}

function renderBoard() {
    board.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const cellId = `c${colIdx}r${rowIdx}`
            const cellEl = document.getElementById(cellId);
            cellEl.innerText = symbols[cellVal];
        })
    })
}

function renderControls() {
    playAgainButton.style.visibility = winner ? 'visible' : 'hidden';
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "IT'S A TIE";
    } else if (winner) {
        messageEl.innerText = symbols[winner] + 'WINS';
    } else {
        messageEl.innerText = 'PLACE ' + symbols[turn];
    }
}

function render() {
    renderBoard();
    renderControls();
    renderMessage();
}

function handlePlace(event) {
    if (winner !== null) return;
    let colIdx;
    if (event.target.classList.contains('left')) {
        colIdx = 0;
    } else if (event.target.classList.contains('middle')) {
        colIdx = 1;
    } else if (event.target.classList.contains('right')) {
        colIdx = 2;
    }
    let rowIdx;
    if (event.target.classList.contains('top')) {
        rowIdx = 2;
    } else if (event.target.classList.contains('center')) {
        rowIdx = 1;
    } else if (event.target.classList.contains('bottom')) {
        rowIdx = 0;
    }
    if (board[colIdx][rowIdx] === -1 || board[colIdx][rowIdx] === 1) return;
    board[colIdx][rowIdx] = turn;
    turn *= -1;
    winner = getWinner(colIdx, rowIdx);
    console.log(winner);
    render();
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    const player = board[colIdx][rowIdx]
    let count = 0

    colIdx += colOffset
    rowIdx += rowOffset

    while (
        board[colIdx] !== undefined && 
        board[colIdx][rowIdx] !== undefined &&
        board[colIdx][rowIdx] === player
    ) {
        count++
        colIdx += colOffset
        rowIdx += rowOffset
    }
    return count
}

function checkVerticalWinner(colIdx, rowIdx) {
    const adjCountDown = countAdjacent(colIdx, rowIdx, 0, -1); 
    const adjCountUp = countAdjacent(colIdx, rowIdx, 0, 1);
    return adjCountDown + adjCountUp >= 2 ? board[colIdx][rowIdx] : null
}
function checkHorizontalWinner(colIdx, rowIdx) {
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0)
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0)
    return adjCountLeft + adjCountRight >= 2 ? board[colIdx][rowIdx] : null
}
function checkDiagonalWinnerNESW(colIdx, rowIdx) {
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1);
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1);
    return adjCountNE + adjCountSW >= 2 ? board[colIdx][rowIdx] : null;
}
function checkDiagonalWinnerNWSE(colIdx, rowIdx) {
    const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1);
    return adjCountNW + adjCountSE >= 2 ? board[colIdx][rowIdx] : null;
}
function checkTie() {
    const row0 = !board[0].includes(0);
    const row1 = !board[1].includes(0);
    const row2 = !board[2].includes(0);
    if (row0 && row1 && row2) {
        return 'T'
    }
}

function getWinner(colIdx, rowIdx) {
    let vert = checkVerticalWinner(colIdx, rowIdx);
    let hori = checkHorizontalWinner(colIdx, rowIdx);
    let nesw = checkDiagonalWinnerNESW(colIdx, rowIdx);
    let nwse = checkDiagonalWinnerNWSE(colIdx, rowIdx);
    let winConditionsArray = [vert, hori, nesw, nwse];
    let winResult = null;
    for (let winCondition of winConditionsArray) {
        if (winCondition !== null) {
            winResult = winCondition;
        }
    }
    if (winResult === null && checkTie() === 'T') {
        winResult = 'T';
    }
    return winResult;
}

/*--- event listeners ---*/
document.getElementById('board').addEventListener('click', handlePlace);
playAgainButton.addEventListener('click', init);