import { useState, useEffect, useRef, useContext } from "react";
import { PokemonContext } from "./pokemonContext/pokemonContext";
import noFoundImage from './assets/noFound.png';

function Item({ image, name, onClickSelectPokemon }) {
  const maxLength = 17;
  const displayName =
    name.length > maxLength ? name.slice(0, maxLength - 3) + "..." : name;

  const handleClick = () => {
    onClickSelectPokemon(image, name);
  };

  return (
    <div className="pokemon_item" onClick={handleClick}>
      <button>
        <img
          style={{ height: "110px", width: "110px" }}
          src={image}
          alt={name}
          onError={(e) => {
            const target = e.target || {};
            target.onerror = null;
            target.src =
              "https://toppng.com//public/uploads/preview/error-handling-windows-xp-error-logo-11563210401mwwnodn9yn.png";
          }}
        />
      </button>
      <h3 className="pokemon_name">{displayName}</h3>
    </div>
  );
}

function Pagination({ searchDone, pokemonList, totalPokemon, onClickPagination, onClickPrevious, onClickTenPrevious, onClickTenNext, onClickNext, currentPage, currentTopPagination, currentBottomPagination, onClickNextMobile, onClickPreviousMobile }) {
  let totalPagination = Math.round(totalPokemon/20);
  const pageNumbers = Array(totalPagination)
  .fill(null)
  .map((_, index) => { 
    const pageNumber = index + 1;
    return pageNumber >= currentBottomPagination && pageNumber <= currentTopPagination ? pageNumber : null;
  })
  .filter(pageNumber => pageNumber !== null);
  return( 
    <>
    <div className={ Object.keys(pokemonList).length > 0 && searchDone ? "no-showPagination" : "pagination-desktop" }>
      <div>
        <button onClick={onClickTenPrevious} className="previousTenPages">&lt;&lt;</button>
        <button onClick={onClickPrevious} className="previousPage">&lt;</button>     
      </div> 
      {pageNumbers.map((pageNumber) => (
        <span key={pageNumber} className={`pagination_number ${currentPage == pageNumber && 'page_active'}`} onClick={onClickPagination}>{pageNumber}</span>
      ))}
      <div>
        <button onClick={onClickNext} className="nextPage">&gt;</button>
        <button onClick={onClickTenNext} className="nextTenPages">&gt;&gt;</button>    
      </div>        
    </div>
    <div className="pagination-mobile">
        <button
        className="nextPages_mobile"
        onClick={onClickNextMobile}>Cargar 20 siguientes &gt;&gt;</button>
        <button
        className="previousPages_mobile"
        onClick={onClickPreviousMobile}
        >&lt;&lt; Cargar 20 anteriores</button>
    </div>
    </>
  )
}

function Searcher({ changePokemonSearched, totalPokemon, onPokemonDataChange }) {
  let pokemonData = [];
  const hasLoadedData = useRef(false);

  async function loadNames() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`);
      if (!response.ok) {
        throw new Error("Ha ocurrido un error");
      }
      const data = await response.json();
      let pokemonInfo = data.results;
      pokemonData = new Array(totalPokemon).fill({});

      for (let i = 0; i < pokemonData.length; i++) {
        let pokemon = {};
        let pokemonSelect = pokemonInfo[i];
        let pokemonID = pokemonSelect.url;
        pokemon.name = pokemonSelect.name;
        pokemon.url = pokemonID;
        pokemonData[i] = pokemon;
      }
      hasLoadedData.current = true;
      onPokemonDataChange(pokemonData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="searcher">
      <div className="searcher_box">
        <input
          className="searcher_input"
          placeholder="🔎 Introduce Pokemon"
          onFocus={() => {
            if (hasLoadedData.current === false) {
              loadNames();
            }
          }}
          onChange={pokemonData.length === 0 ? changePokemonSearched : undefined}
        />
      </div>
    </div>
  );
}
 
export default function SelectorBoard() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [offsetInit, setOffsetInit] = useState(0);
  const [limitInit, setLimitInit] = useState(20);
  const [searchDone, setSearchDone] = useState(false);
  const [pokemonList, setPokemonList] = useState([]);//-->contains pokemonList pagination
  const [pokemonData, setPokemonData] = useState([]);//--> contains total pokemonList
  const [fullPokemonList, setFullPokemonList] = useState([]);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBottomPagination, setCurrentBottomPagination] = useState(1);
  const [currentTopPagination, setCurrentTopPagination] = useState(10);
  const {handlePokemonSelection, playerPokemon1, playerPokemon2, resetBoard} = useContext(PokemonContext);
  const showBoard = Object.keys(playerPokemon2).length > 0;
  const showArrow = Object.keys(playerPokemon1).length > 0 && currentPlayer == 2;
  const [hideBlock, setHideBlock] = useState(false);
  const numRows = 4;
  const numItemsPerRow = 4;//->after, 5
  let totalPagination = Math.round(totalPokemon/20);
  
  const clickPagination = (event) =>{
    let pageNumber = parseInt(event.target.textContent);
    setCurrentPage(pageNumber);
    let newLimitInit = pageNumber*20;
    let newOffsetInit = newLimitInit - 20;
    setLimitInit(newLimitInit);
    setOffsetInit(newOffsetInit);
  }

  const clickPaginationMobile = () =>{
    let pageNumber = currentPage;
    setCurrentPage(pageNumber+1 < totalPagination ? pageNumber+=1 : totalPagination);
    console.log(currentPage)
    let newLimitInit = pageNumber*20;
    let newOffsetInit = newLimitInit - 20;
    console.log(`newLimitInit: ${newLimitInit}; newOffsetInit: ${newOffsetInit}`)
    setLimitInit(newLimitInit);
    setOffsetInit(newOffsetInit);
  }

  const clickPaginationPreviousMobile = () =>{
    let pageNumber = currentPage;
    setCurrentPage(pageNumber-1 > 0 ? pageNumber-=1 > 0 : 1);
    let newLimitInit = pageNumber*20;
    let newOffsetInit = newLimitInit - 20;
    setLimitInit(newLimitInit);
    setOffsetInit(newOffsetInit);
  }
  
  const changePokemonSearched = (event) => {
    const searchTerm = event.target.value;
    if (searchTerm.length > 3) {
      const pokemonFound = findPokemon(pokemonData, searchTerm);
      setPokemonList(pokemonFound);
      setSearchDone(true);
    } else if (searchTerm.length < 3) {
      setSearchDone(false);
      setPokemonList(fullPokemonList);
    }
  };

  function findPokemon(array, str) {
    const results = array.filter(pokemon => {
      return typeof pokemon.name === 'string' && pokemon.name.toLowerCase().includes(str.toLowerCase());
    });  
    return results;
  }

  function clickNext(){
    let newTopPagination = currentTopPagination + 1 > totalPagination ? totalPagination : currentTopPagination + 1;
    setCurrentTopPagination(newTopPagination);
    setCurrentBottomPagination(currentBottomPagination + 1 > totalPagination - 10 ? totalPagination - 10 : currentBottomPagination + 1);     
  }

  function clickPrevious(){
    let newBottomPagination = currentBottomPagination - 1 < 1 ? 1 : currentBottomPagination - 1;
    setCurrentBottomPagination(newBottomPagination);
    setCurrentTopPagination(currentTopPagination - 1 < 10 ? 10 : currentTopPagination - 1 );    
  }

  function clickTenNext(){
    let newTopPagination = currentTopPagination + 10 > totalPagination ? totalPagination : currentTopPagination + 10;
    setCurrentTopPagination(newTopPagination);
    setCurrentBottomPagination(currentBottomPagination + 10 > totalPagination - 10 ? totalPagination - 10 : currentBottomPagination + 10); 
  }

  function clickTenPrevious(){
    let newBottomPagination = currentBottomPagination - 10 < 1 ? 1 : currentBottomPagination - 10;
    setCurrentBottomPagination(newBottomPagination);
    setCurrentTopPagination(currentTopPagination - 10 < 10 ? 10 : currentTopPagination - 10 );   
  }

  const clickSelectPokemon = (selectedImage, selectedName) => {
    handlePokemonSelection({ selectedImage, selectedName }, currentPlayer);
    let newCurrentPlayer = currentPlayer < 2 ? currentPlayer + 1 : currentPlayer;
    setCurrentPlayer(newCurrentPlayer);
    setSearchDone(false);
    setPokemonList(fullPokemonList);
  };

  const hideAfterAnimation = (e) => {
    showBoard && setHideBlock(true);
  }
  
  useEffect(() => {
    async function fetchPokemonList() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?offset=${offsetInit}&limit=${limitInit}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener la lista de Pokémon");
        }
        const data = await response.json();
        setPokemonList(data.results);
        setTotalPokemon(data.count);
        setFullPokemonList(data.results);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPokemonList();
  }, [offsetInit, limitInit]);

  useEffect(() => {
    setPokemonList(fullPokemonList);
    setHideBlock(false);
    resetBoard == true && setCurrentPlayer(1);
  }, [resetBoard])

  return (    
    <>
      { pokemonList.length > 0 ? (        
        <div key={currentPlayer} 
        className={ showBoard ? "no-showSelectorBoard" : "showSelectorBoard" }
        onAnimationEnd = { hideAfterAnimation }
        style={{ display: hideBlock && 'none' }}
        >
          <div className="header-board">
            <h3 className="board-title">Jugador {currentPlayer}, elige Pokémon</h3>
            <Searcher changePokemonSearched={changePokemonSearched} onPokemonDataChange={setPokemonData} totalPokemon={totalPokemon} />
            <span 
              className={ showArrow ? "arrow-board" : "arrow-board-hide" }
              onClick={() => setCurrentPlayer(1)}
              >
              <svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 -960 960 960" width="48"><path d="M480-160 160-480l320-320 42 42-248 248h526v60H274l248 248-42 42Z" fill="#0000FF"/></svg>
              Cambiar elección Jugador 1</span>
          </div>
          {Array(numRows)
            .fill(null)
            .map((_, row) => (
              <div key={row} className="row-board">
                {Array(numItemsPerRow)
                  .fill(null)
                  .map((_, numItem) => {
                    const itemIndex = row * numItemsPerRow + numItem;
                    if (itemIndex < limitInit) {
                      const pokemon = pokemonList[itemIndex];
                      if (!pokemon) {
                        return null;
                      }
                      const pokemonImageURL = pokemon.url.split("/");
                      const pokemonImageId = pokemonImageURL[6];
                      return (                      
                        <Item
                          key={pokemonImageId}
                          image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonImageId}.png`}
                          name={pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                          onClickSelectPokemon={clickSelectPokemon}
                        />                      
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            ))}
        <Pagination 
          key={totalPokemon} 
          totalPokemon={totalPokemon} 
          searchDone={searchDone}
          pokemonList={pokemonList}
          currentPage={currentPage}
          currentBottomPagination={currentBottomPagination}
          currentTopPagination={currentTopPagination}
          onClickPagination={clickPagination}
          onClickPrevious={clickPrevious}
          onClickTenPrevious={clickTenPrevious}
          onClickTenNext={clickTenNext}
          onClickNext={clickNext}
          onClickNextMobile={clickPaginationMobile}
          onClickPreviousMobile={clickPaginationPreviousMobile}
        />
        </div>
      ) : ( searchDone ? (
          <>
            <h3 className="board-title">No se ha encontrado ningún Pokémon</h3>
            <Searcher changePokemonSearched={changePokemonSearched} onPokemonDataChange={setPokemonData} totalPokemon={totalPokemon} />
            <img src={noFoundImage} style={{ width: '275px' }} alt="Not found" />
            <div className="return-search">
              <button 
                className="return-search-button"
                onClick={() => {
                  setPokemonList(fullPokemonList);
                  setSearchDone(false);
                }}>Inténtalo con otro nombre
              </button>
            </div>
          </>
        ) : (
          <div className="loading">Cargando Pokemon...</div>
        )
      )}
    </>
  );
}