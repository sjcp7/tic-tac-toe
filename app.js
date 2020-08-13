const Gameboard = (() => {
  const board = new Array(9).fill(null);
  const getBoard = () => board;
  const pushToBoard = (marker, pos) => {
    board.splice(pos, 1, marker);
  }
  return {
    getBoard,
    pushToBoard
  }
})();

const Player = (name, marker, playing) => {
  const isPlaying = () => playing;
  const togglePlaying = () => { playing = !(playing) }
  const play = (pos) => {
    Gameboard.pushToBoard(marker, pos);    
  }
  return {
    togglePlaying,
    isPlaying,
    play
  }
}

const DisplayController = (() => {
  const boardArr = Gameboard.getBoard();
  const getBoard = () => document.querySelector("#board");
  const getCells = () => document.querySelectorAll(".cell");

  const render = () => {
    const cells = getCells();
    cells.forEach(cell => {
      cell.innerHTML = '';
      const dataCell = Number(cell.dataset.cell);

      if(boardArr[dataCell] === null) { return }
      else {
        const cellText = document.createTextNode(boardArr[dataCell]);
        cell.appendChild(cellText);
      }
    });
  }
  return {
    render,
    getBoard,
    getCells
  }
})();

const Game = (() => {
  const player1 = Player("player1", "X", true);
  const player2 = Player("player2", "O", false);
  const cells = DisplayController.getCells();

  const switchActivePlayer = () => {
    player1.togglePlaying();
    player2.togglePlaying();
  }

  const handleClick = (e) => {
    const cellEl = e.target;
    const pos = cellEl.dataset.cell;  

    if(cellEl.innerHTML !== '') return;

    if(player1.isPlaying()) {
      player1.play(pos);
    }

    if(player2.isPlaying()) {
      player2.play(pos);
    }
    switchActivePlayer();

    DisplayController.render();
  }

  cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
  })

})();

