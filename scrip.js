const PLAYER_X_CLASS = 'player-x';
const PLAYER_O_CLASS = 'player-o';
const WINNING_COMBINATIONS = [
    // Horizontal combinations
    [0, 1, 2],
    [3, 4, 5],  
    [6, 7, 8],
    // Vertical combinations
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal combinations
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const boardElement = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton'); // replace 'restartButton' with the id of your button in the HTML
restartButton.addEventListener('click', resetGame);

let isPlayer_O_Turn = false;
let isGameActive = true;
let player_x_score = localStorage.getItem('player_x_score') ? parseInt(localStorage.getItem('player_x_score')) : 0;
let player_o_score = localStorage.getItem('player_o_score') ? parseInt(localStorage.getItem('player_o_score')) : 0;
let draw_score = 0;

startGame();

function startGame() {
    isPlayer_O_Turn = false;
    isGameActive = true;
    cellElements.forEach(cell => {
        cell.classList.remove(PLAYER_X_CLASS); // Remove all classes from the cell element (for styling)  
        cell.classList.remove(PLAYER_O_CLASS); // Remove all classes from the cell element (for styling) // This is to prevent the classes from stacking up when the game is restarted
        cell.removeEventListener('click', handleCellClick); // Remove all event listeners from the cell element (for gameplay)  // This is to prevent the event listeners from stacking up when the game is restarted
        cell.addEventListener('click', handleCellClick, { once: true }); // Add an event listener to the cell element (for gameplay) / / { once: true } means that the event listener will be removed after the first click
    });

    setBoardHoverClass();
    winningMessageElement.classList.remove('show'); // Hide the winning message
}

function handleCellClick(e) {
    if (!isGameActive) return;

    const cell = e.target;
    const currentClass = isPlayer_O_Turn ? PLAYER_O_CLASS : PLAYER_X_CLASS;
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    isGameActive = false;

    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
        draw_score++;
    } else {
        winningMessageTextElement.innerText = `${isPlayer_O_Turn ? "O's" : "X's"} Wins!`;
        if (isPlayer_O_Turn) {
            player_o_score++;
        } else {
            player_x_score++;
        }
    }
    // Instead of adding a class to the whole element, directly change the text of the specific element
    winningMessageTextElement.innerText = `${winningMessageTextElement.innerText} (Click to reset)`;
    displayScores();
}

// At the start of your script


// Display the scores
displayScores();
function resetGame() {
    // Save scores to local storage
    localStorage.setItem('player_x_score', player_x_score);
    localStorage.setItem('player_o_score', player_o_score);

    // Reload the page
    location.reload();
}
resetButton.addEventListener('click', resetGame);

function isDraw() {
    return [...cellElements].every(cell => cell.classList.contains(PLAYER_X_CLASS) || cell.classList.contains(PLAYER_O_CLASS));
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass); // For styling the cell
    cell.innerText = isPlayer_O_Turn ? 'O' : 'X'; // For displaying O or X in the cell
}

function swapTurns() {
    isPlayer_O_Turn = !isPlayer_O_Turn;
}

function setBoardHoverClass() {
    boardElement.classList.remove(PLAYER_X_CLASS);
    boardElement.classList.remove(PLAYER_O_CLASS);
    if (isPlayer_O_Turn) {
        boardElement.classList.add(PLAYER_O_CLASS);
    } else {
        boardElement.classList.add(PLAYER_X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => cellElements[index].classList.contains(currentClass));
    });
}

function displayScores() {
    document.getElementById('playerXScore').innerText = `Player X: ${player_x_score}`;
    document.getElementById('playerOScore').innerText = `Player O: ${player_o_score}`;
    document.getElementById('drawScore').innerText = `Draws: ${draw_score}`;
}