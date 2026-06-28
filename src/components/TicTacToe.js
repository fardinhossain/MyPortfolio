import './TicTacToe.css';
import { iconBot } from '../icons.js';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getGameResult(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  return board.every(Boolean) ? { winner: 'draw', line: [] } : null;
}

function minimax(board, depth, isMaximizing) {
  const result = getGameResult(board);
  if (result?.winner === 'O') return 10 - depth;
  if (result?.winner === 'X') return depth - 10;
  if (result?.winner === 'draw') return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;

    board[index] = isMaximizing ? 'O' : 'X';
    const score = minimax(board, depth + 1, !isMaximizing);
    board[index] = '';
    bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
  }

  return bestScore;
}

export function getBestMove(board) {
  let bestScore = -Infinity;
  const bestMoves = [];

  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;

    board[index] = 'O';
    const score = minimax(board, 0, false);
    board[index] = '';

    if (score > bestScore) {
      bestScore = score;
      bestMoves.length = 0;
      bestMoves.push(index);
    } else if (score === bestScore) {
      bestMoves.push(index);
    }
  }

  if (!bestMoves.length) return -1;
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export function renderTicTacToe() {
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    return `<button type="button" class="tic-tac-toe__cell" data-cell="${index}" role="gridcell" aria-label="Row ${row}, column ${column}"></button>`;
  }).join('');

  return `
    <section class="tic-tac-toe" id="tic-tac-toe" aria-labelledby="tic-tac-toe-title">
      <div class="tic-tac-toe__header">
        <div class="tic-tac-toe__heading">
          <span class="tic-tac-toe__icon-wrap">${iconBot(16, 'tic-tac-toe__icon')}</span>
          <div>
            <h3 class="tic-tac-toe__title" id="tic-tac-toe-title">Play Fardin AI</h3>
            <p class="tic-tac-toe__subtitle">Tic-tac-toe · Hard mode</p>
          </div>
        </div>
        <button type="button" class="tic-tac-toe__reset" id="tic-tac-toe-reset">New round</button>
      </div>

      <p class="tic-tac-toe__status" id="tic-tac-toe-status" role="status" aria-live="polite">Your turn — place an X.</p>

      <div class="tic-tac-toe__play-area">
        <div class="tic-tac-toe__board" id="tic-tac-toe-board" role="grid" aria-label="Tic-tac-toe board">
          ${cells}
        </div>

        <div class="tic-tac-toe__scoreboard" aria-label="Game score">
          <div class="tic-tac-toe__score tic-tac-toe__score--player">
            <span>You · X</span>
            <strong id="tic-score-player">0</strong>
          </div>
          <div class="tic-tac-toe__score">
            <span>Draws</span>
            <strong id="tic-score-draw">0</strong>
          </div>
          <div class="tic-tac-toe__score tic-tac-toe__score--ai">
            <span>AI · O</span>
            <strong id="tic-score-ai">0</strong>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initTicTacToe() {
  const game = document.getElementById('tic-tac-toe');
  if (!game) return;

  const cells = [...game.querySelectorAll('[data-cell]')];
  const boardElement = game.querySelector('#tic-tac-toe-board');
  const status = game.querySelector('#tic-tac-toe-status');
  const resetButton = game.querySelector('#tic-tac-toe-reset');
  const scoreElements = {
    X: game.querySelector('#tic-score-player'),
    O: game.querySelector('#tic-score-ai'),
    draw: game.querySelector('#tic-score-draw'),
  };
  const board = Array(9).fill('');
  const scores = { X: 0, O: 0, draw: 0 };
  let isGameOver = false;
  let isAiThinking = false;
  let aiTimer;

  function renderBoard() {
    cells.forEach((cell, index) => {
      const mark = board[index];
      const row = Math.floor(index / 3) + 1;
      const column = (index % 3) + 1;
      cell.textContent = mark;
      cell.dataset.mark = mark;
      cell.disabled = Boolean(mark) || isGameOver || isAiThinking;
      cell.setAttribute('aria-label', `Row ${row}, column ${column}${mark ? `, ${mark}` : ''}`);
    });

    boardElement.classList.toggle('is-thinking', isAiThinking);
  }

  function finishGame(result) {
    isGameOver = true;
    scores[result.winner] += 1;
    scoreElements[result.winner].textContent = scores[result.winner];

    if (result.winner === 'X') {
      status.textContent = 'You beat Fardin AI — nicely played!';
    } else if (result.winner === 'O') {
      status.textContent = 'Fardin AI wins this round. Run it back?';
    } else {
      status.textContent = 'Clean draw — you held the line.';
    }

    result.line.forEach((index) => cells[index].classList.add('is-winning'));
    resetButton.textContent = 'Play again';
    renderBoard();
  }

  function checkGame() {
    const result = getGameResult(board);
    if (result) finishGame(result);
    return Boolean(result);
  }

  function makeAiMove() {
    if (isGameOver) return;

    const move = getBestMove(board);
    if (move >= 0) board[move] = 'O';
    isAiThinking = false;

    if (!checkGame()) {
      status.textContent = 'Your turn — place an X.';
      renderBoard();
    }
  }

  function handlePlayerMove(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.cell);
    if (board[index] || isGameOver || isAiThinking) return;

    board[index] = 'X';
    renderBoard();
    if (checkGame()) return;

    isAiThinking = true;
    status.textContent = 'Fardin AI is thinking...';
    renderBoard();
    aiTimer = window.setTimeout(makeAiMove, 420);
  }

  function resetGame() {
    window.clearTimeout(aiTimer);
    board.fill('');
    isGameOver = false;
    isAiThinking = false;
    cells.forEach((cell) => cell.classList.remove('is-winning'));
    status.textContent = 'Your turn — place an X.';
    resetButton.textContent = 'New round';
    renderBoard();
  }

  cells.forEach((cell) => cell.addEventListener('click', handlePlayerMove));
  resetButton.addEventListener('click', resetGame);
  renderBoard();
}
