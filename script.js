let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
const human = "X";
const ai = "O";

function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board.forEach((cell, index) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.innerText = cell;
        div.onclick = () => makeMove(index);
        boardDiv.appendChild(div);
    });
}

function makeMove(index) {
    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        updateBoard();

        if (checkWin(currentPlayer)) {
            document.getElementById("status").innerText = `🎉 Player ${currentPlayer} Wins!`;
            gameActive = false;
            return;
        }

        if (!board.includes("")) {
            document.getElementById("status").innerText = "🤝 It's a Draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (currentPlayer === ai) {
            setTimeout(aiMove, 500); // Delay AI move for better UX
        }

        document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;
    }
}

function aiMove() {
    let bestMove = minimax(board, ai).index;
    board[bestMove] = ai;
    updateBoard();

    if (checkWin(ai)) {
        document.getElementById("status").innerText = `🤖 AI Wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        document.getElementById("status").innerText = "🤝 It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = human;
    document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

    if (checkWin(human)) return { score: -10 };
    if (checkWin(ai)) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === ai) {
            let result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = ""; // Undo move
        moves.push(move);
    }

    let bestMove;
    if (player === ai) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function updateBoard() {
    createBoard();
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = human;
    document.getElementById("status").innerText = `Player X's turn`;
    createBoard();
}
