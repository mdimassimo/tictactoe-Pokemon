import { useState, useContext, useEffect } from "react";
import { PokemonContext } from "./pokemonContext/pokemonContext";
import ashKetchum from './assets/Pokemon-Ash-Ketchum-PNG-File.png';

function Square ({ value, clickSquare }) {
  return (
    <>
      <button className="square vibrate" onClick={clickSquare}>
        <img src={value} style={{ width: '100%' }}/>
      </button>
    </>
  );
}

export default function Board() {
  const [ squares, setSquares ] = useState(Array(9).fill(null));
  const { playerPokemon1, playerPokemon2, resetGame,dropConfetti } = useContext(PokemonContext);
  const [ player1Next, setPlayer1Next ] = useState(true);
  const [ tie, setTie ] = useState(false);
  const showBoard = Object.keys(playerPokemon2).length > 0;
  const winner = calculateWinner(squares);
  let status;
  let nameWinner;
  if (winner) {
    nameWinner = winner == playerPokemon1.selectedImage ? playerPokemon1.selectedName : playerPokemon2.selectedName;
    status = "Ganador: " + nameWinner;
  } else if (!winner && tie ){
    status = "¡Empate!";
  } 
  else {
    status = "Turno del jugador " + (player1Next ? "1" : "2") + " - " + (player1Next ? playerPokemon1.selectedName : playerPokemon2.selectedName);
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();//-> Copy of squares (immutability)
    if (player1Next) {
      nextSquares[i] = playerPokemon1.selectedImage;
      setPlayer1Next(false);
    } else {
      nextSquares[i] = playerPokemon2.selectedImage;
      setPlayer1Next(true);
    }
    setSquares(nextSquares);    
    const boardComplete = nextSquares.find(square => square == null);
    if(boardComplete === undefined){
      setTie(true);
    } 
  }

  function handleRestartGame() {
    resetGame(); 
    setSquares(Array(9).fill(null));
    setPlayer1Next(true);
    setTie(false);
  }

  useEffect(()=>{
    winner && dropConfetti();
  }, [winner])

  return (
    !winner && !tie ? (
      <>
        <div className={showBoard ? 'showPlayingBoard' : 'no-showPlayingBoard'}>
          <div className="status">{status}</div>
          <div className="row-board">
            <Square value={squares[0]} clickSquare={() => handleClick(0)} />
            <Square value={squares[1]} clickSquare={() => handleClick(1)} />
            <Square value={squares[2]} clickSquare={() => handleClick(2)} />
          </div>
          <div className="row-board">
            <Square value={squares[3]} clickSquare={() => handleClick(3)} />
            <Square value={squares[4]} clickSquare={() => handleClick(4)} />
            <Square value={squares[5]} clickSquare={() => handleClick(5)} />
          </div>
          <div className="row-board">
            <Square value={squares[6]} clickSquare={() => handleClick(6)} />
            <Square value={squares[7]} clickSquare={() => handleClick(7)} />
            <Square value={squares[8]} clickSquare={() => handleClick(8)} />
          </div>
        </div>
      </>
    ) : (
      winner ? (          
        <div className="resultGame">
          <h3>¡Ha ganado {nameWinner}!</h3>
          <img src={winner}
          width={"230px"}></img>     
          <button
          onClick={handleRestartGame}>¡Revancha!</button>   
        </div>         
      ) : (
        <div className="resultGame">
          <h3>Hay un empate</h3>
          <img src={ashKetchum}
          style={{width:"180px"}}></img>
          <button
          onClick={handleRestartGame}>¡Revancha!</button>
        </div>
        
      )
    )
  );

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //--> squares[a], squares[b] and squares[c] have the same value (either 'X'[pokemon1] or 'O'[pokemon2])
      return squares[a];
    }
  }
  return null;
}}
