import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./wining";
import GameOver from "./components/Gameover";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(prevTurns) {
  let currentPlayer = "X";
  if (prevTurns.length > 0 && prevTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player 2",
  });
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard].map((array) => [...array]);
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }

  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const fitstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      fitstSquareSymbol &&
      fitstSquareSymbol === secondSquareSymbol &&
      fitstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[fitstSquareSymbol];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSqaure(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlyaerNameChange(symbol, newName) {
    setPlayers((prev) => {
      return {
        ...prev,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            name="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlyaerNameChange}
          />
          <Player
            name="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlyaerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSqaure} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
