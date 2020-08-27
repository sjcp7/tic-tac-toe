const Gameboard = (() => {
  const _board = ['', '', '', '', '', '', '', '', ''];

  function getBoard() { return _board }

  function resetBoard() { _board = ['', '', '', '', '', '', '', '', '']; }

  function getDLines() {
    return [
      _board[0] + _board[4] + _board[8],   // Top left - bottom right
      _board[2] + _board[4] + _board[6]    // Top right - bottom left
    ]
  }

  function getHLines() {
    return [
      _board[0] + _board[1] + _board[2],   // Top row
      _board[3] + _board[4] + _board[5],   // Middle row
      _board[6] + _board[7] + _board[8]   // Bottom row
    ]
  }

  function getVLines() {
    return [
      _board[0] + _board[3] + _board[6],   // Left column
      _board[1] + _board[4] + _board[7],   // Middle column
      _board[2] + _board[5] + _board[8]    // Right column
    ]
  }
  
  function pushToBoard(pos, mark) { _board.splice(pos, 1, mark) }

  return {
    getBoard,
    resetBoard,
    getDLines,
    getHLines,
    getVLines,
    pushToBoard
  }
})();

function Player(name, mark, playing) {
  let _score = 0;
  let _playing = playing;
  function getName() { return name }
  function setName(newName) { name = newName }
  function getMark() { return mark }
  function getScore() { return _score } 
  function isPlaying() { return _playing }
  function togglePlaying() { _playing = !_playing }
  function win() { _score += 1 }
  function resetScore() { _score = 0 }
  function play(pos) { Gameboard.pushToBoard(pos, mark) }
  return {
    getName,
    getMark,
    getScore,
    resetScore,
    setName,
    win,
    play,
    isPlaying,
    togglePlaying
  }
}


const DisplayController = (function() {
  function getBoard() {
    const board = document.querySelector('#board');
    return board;
  }

  function getCells() {
    const cells = document.querySelectorAll('.cell');
    return cells;
  }

  function getPlayerCards() {
    const cards = document.querySelectorAll('.player-board');
    return cards;
  }

  function getPlayerNames() {
    const names = document.querySelector('.player-name');
    return names;
  }
  
  function getModal() {
    const modal = document.querySelector('#modal-form');
    return modal;
  }

  function getPlayerScores() {
    const scores = document.querySelectorAll('.player-score');
    return scores;
  }
  
  function render() {
    const board = Gameboard.getBoard();
    const cells = getCells();
    cells.forEach(cell => {
      cell.innerHTML = '';
      const index = Number(cell.dataset.cell);
      const mark = document.createTextNode(board[index]);
      cell.appendChild(mark);
    })

  }

  function getPlayBtn() {
    const btn = document.querySelector('#submit');
    return btn;
  }

  

  return {
    getBoard,
    getCells,
    getPlayerNames,
    getPlayerCards,
    getModal,
    getPlayBtn,
    getPlayerScores,
    render
  }
})();

const Game = (() => {
  
  const p1 = Player('player1', 'X', true);
  const p2 = Player('player2', 'O', false);
  let winner = 0; // 0 = draw, 1 = p1 win, -1 = p2 win
  let gameOver = false;
  let playing = false;

  function switchActivePlayer() {
    p1.togglePlaying();
    p2.togglePlaying();
  }

  function checkW(lines) {
    let res = true;
    if (lines.includes('XXX')) {
      winner = 1;
      p1.win();
    } else if (lines.includes('OOO')) {
        winner = -1;
        p2.win();
    } else {
        res = false;
        winner = 0;
    }
    return res;
  }

  function checkDLines() {
    const dLines = Gameboard.getDLines();
    return checkW(dLines);
  }

  function checkVLines() {
    const vLines = Gameboard.getVLines();
    return checkW(vLines);
  }

  function checkHLines() {
    const hLines = Gameboard.getHLines();
    return checkW(hLines);
  }

  function isCellChecked(cellIndex) {
    const board = Gameboard.getBoard();
    if (board[cellIndex] === '') { return false }
    return true;
  }

  function isGameOver() {
    let res = !(Gameboard.getBoard().includes(''));
    if (checkDLines() || checkVLines() || checkHLines()) {
      res = true;
    }

    gameOver = res;
    return res;
  }

  function startGame(e) {
    playing = true;
    names = DisplayController.getPlayerNames();
    p1.setName(names[0]);
    p2.setName(names[1]);
    DisplayController.getModal().style.display = 'none';
  }

  function resetGame() {
    playing = false;
    DisplayController.getModal().style.display = 'block';
    resetScores();
    Gameboard.resetBoard();
  }

  function updateScores() {
    const scores = DisplayController.getPlayerScores();
    scores[0].innerHTML = p1.getScore();
    scores[1].innerHTML = p1.getScore();
  }

  function resetScores() {
    p1.resetScore();
    p2.resetScore();
  }

  function play(e) {
    const cellIndex = e.target.dataset.cell;
    if (!gameOver){
      if (isCellChecked(cellIndex)) { return }
      const playerCards = DisplayController.getPlayerCards();
      if (p1.isPlaying()) {
        playerCards[1].classList.add('playing');
        playerCards[0].classList.remove('playing');
        p1.play(cellIndex);
      } 
      
      else {
        playerCards[0].classList.add('playing');
        playerCards[1].classList.remove('playing');
        p2.play(cellIndex);
      }
      switchActivePlayer();
      isGameOver();
      DisplayController.render();
    } 
    if (gameOver) {
      alert('Game is over');
    }

  }

  const playBtn = DisplayController.getPlayBtn();
  playBtn.addEventListener('click', startGame);

  const cells = DisplayController.getCells();
  cells.forEach(cell => {
    cell.addEventListener('click', play);
  })


})();

// Thank you, Lucas Bide (github.com/Lucas-Bide)
