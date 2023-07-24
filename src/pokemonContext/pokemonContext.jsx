import { createContext, useState, useEffect } from "react";
import Confetti from 'react-confetti';

export const PokemonContext = createContext();

export const PokemonProvider = ({children}) => {
    const [playerPokemon1, setPlayerPokemon1] = useState({});
    const [playerPokemon2, setPlayerPokemon2] = useState({});
    const [resetBoard, setResetBoard] =  useState(false);
    const [celebration, setCelebration] =  useState(false);

    const handlePokemonSelection = (pokemon, player) => {
        setResetBoard(false);
        if (player === 1) {
          setPlayerPokemon1(pokemon);
        } else if (player === 2) {
          setPlayerPokemon2(pokemon);
        }
      };    
    
    const resetGame = () => {
      setPlayerPokemon1({});
      setPlayerPokemon2({});
      setResetBoard(true);
      setCelebration(false);
    }

    const dropConfetti = () =>{
      setCelebration(true);
    }
  
    const contextValue = {
      playerPokemon1,
      playerPokemon2,
      resetBoard,
      celebration,
      dropConfetti,
      setResetBoard,
      handlePokemonSelection,
      resetGame
    }

      return(
        <PokemonContext.Provider value={contextValue}>
            {celebration && <Confetti/>}
            {children}
        </PokemonContext.Provider>
      )
}