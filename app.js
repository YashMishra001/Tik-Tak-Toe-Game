let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let msg = document.querySelector("#msg");
let newGame = document.querySelector("#newGame-btn");
let container = document.querySelector(".msg-container");

let aiPlayer = "X";
let humanPlayer = "O";
let gameOver = false;
let aiMistakeChance = 0;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];


document.querySelector("#difficulty").addEventListener("change", (e) => {
  aiMistakeChance = parseFloat(e.target.value);
});


const resetGame = () => {
  gameOver = false;
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
  });
  container.classList.add("hide");
};

reset.addEventListener("click", resetGame);
newGame.addEventListener("click", resetGame);


boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (gameOver || box.innerText !== "") return;

    box.innerText = humanPlayer;
    box.disabled = true;

    if (checkWinner(humanPlayer)) {
      endGame(humanPlayer);
      return;
    }

    if ([...boxes].every(box => box.innerText !== "")) {
      endGame("No one");
      return;
    }


    setTimeout(() => {
      aiMove();
      if (checkWinner(aiPlayer)) {
        endGame(aiPlayer);
        return;
      }

      if ([...boxes].every(box => box.innerText !== "")) {
        endGame("No one");
      }
    }, 200);
  });
});


const getBoardState = () => [...boxes].map(box => box.innerText);


const aiMove = () => {
  if (gameOver) return;

  const board = getBoardState();
  const emptyIndices = board
    .map((val, idx) => val === "" ? idx : null)
    .filter(idx => idx !== null);

  let move;


  const shouldMakeMistake = Math.random() < aiMistakeChance;

  if (shouldMakeMistake) {
    move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  } else {
    let bestScore = -Infinity;
    for (let idx of emptyIndices) {
      board[idx] = aiPlayer;
      const score = minimax(board, 0, false);
      board[idx] = "";
      if (score > bestScore) {
        bestScore = score;
        move = idx;
      }
    }
  }

  if (move !== undefined) {
    boxes[move].innerText = aiPlayer;
    boxes[move].disabled = true;
  }
};


const minimax = (board, depth, isMaximizing) => {
  const score = evaluate(board);
  if (score !== null) return score - depth;

  const emptyIndices = board
    .map((val, idx) => val === "" ? idx : null)
    .filter(idx => idx !== null);

  if (isMaximizing) {
    let best = -Infinity;
    for (let idx of emptyIndices) {
      board[idx] = aiPlayer;
      const val = minimax(board, depth + 1, false);
      board[idx] = "";
      best = Math.max(best, val);
    }
    return best;
  } else {
    let best = Infinity;
    for (let idx of emptyIndices) {
      board[idx] = humanPlayer;
      const val = minimax(board, depth + 1, true);
      board[idx] = "";
      best = Math.min(best, val);
    }
    return best;
  }
};


const evaluate = (board) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a] === aiPlayer ? 10 : -10;
    }
  }

  if (board.every(cell => cell !== "")) return 0; // Draw
  return null;
};


const checkWinner = (player) => {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return boxes[a].innerText === player &&
      boxes[b].innerText === player &&
      boxes[c].innerText === player;
  });
};


const endGame = (winner) => {
  gameOver = true;
  msg.innerHTML = winner === "No one"
    ? `😐 It's a draw!`
    : `🎉 Congratulations! <span class="winner-name">"${winner}"</span> wins! 🎉`;
  container.classList.remove("hide");
  boxes.forEach((box) => box.disabled = true);
};
