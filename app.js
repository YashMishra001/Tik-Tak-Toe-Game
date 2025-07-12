let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let msg = document.querySelector("#msg");
let newGame = document.querySelector("#newGame-btn");
let container = document.querySelector(".msg-container");
let main = document.querySelector("main");

let aiPlayer = "X";
let humanPlayer = "O";
let gameOver = false;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

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
    }, 30);
  });
});

const aiMove = () => {
  if (gameOver) return;

  let bestScore = -Infinity;
  let move;

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = aiPlayer;
      let score = minimax(boxes, 0, false);
      box.innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  if (move !== undefined) {
    boxes[move].innerText = aiPlayer;
    boxes[move].disabled = true;
  }
};

const minimax = (newBoxes, depth, isMaximizing) => {
  let score = evaluate(newBoxes);
  if (score !== null) return score;

  if (isMaximizing) {
    let best = -Infinity;
    newBoxes.forEach((box) => {
      if (box.innerText === "") {
        box.innerText = aiPlayer;
        let val = minimax(newBoxes, depth + 1, false);
        box.innerText = "";
        best = Math.max(best, val);
      }
    });
    return best;
  } else {
    let best = Infinity;
    newBoxes.forEach((box) => {
      if (box.innerText === "") {
        box.innerText = humanPlayer;
        let val = minimax(newBoxes, depth + 1, true);
        box.innerText = "";
        best = Math.min(best, val);
      }
    });
    return best;
  }
};

const evaluate = (boxes) => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let v1 = boxes[a].innerText;
    let v2 = boxes[b].innerText;
    let v3 = boxes[c].innerText;
    if (v1 && v1 === v2 && v2 === v3) {
      if (v1 === aiPlayer) return 10;
      if (v1 === humanPlayer) return -10;
    }
  }

  if ([...boxes].every(box => box.innerText !== "")) return 0;
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
