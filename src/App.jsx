import './App.css';
import Board from './Board';
import Selector from './Selector';
import { PokemonProvider } from './pokemonContext/pokemonContext';
import logotype from './assets/logo.png';

function HeaderApp(){  
  return(    
  <header className='headerApp'>
    <div className='headerApp-container'>
      <img className='headerApp-logo' 
      src={logotype} 
      ></img>
    </div>
  </header>
  )
}

function App() {
  return (
    <PokemonProvider>
      <HeaderApp/>
      <main className='mainBoard'>
        <Selector/>
        <Board/>
      </main>
    </PokemonProvider>
  )
}

export default App;
