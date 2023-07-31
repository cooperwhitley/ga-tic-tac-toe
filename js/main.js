/*--- constants ---*/

const symbols = {
    0: 'none',
    1: 'X',
    '-1': 'O'
}

/*--- state variables ---*/

let board;
let turn;
let winner;

/*--- cached elements ---*/

const messageEl = document.getElementById('message');
const playAgainButton = document.querySelector('button');

/*--- functions ---*/



/*--- event listeners ---*/