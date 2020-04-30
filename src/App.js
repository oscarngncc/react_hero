import React from 'react';
import Style from './css/Style.module.css';
import Player from './components/entity/Player';
import Monster from './components/entity/Monster';
import HandDraw from './components/card/HandDraw';
import Deck from './components/card/Deck';
import StatusBar from './components/ui/CharacterStatusBar';
import AppBar from './components/ui/AppBar';


function App() {
  return (
    <div className= {Style.app} align="center">
      <div className= {Style.game} align="center" >
        <AppBar/>
        <div className={Style.backgroundIMG}  ></div>
        <Monster/>
        <Player/>
        <StatusBar />
        <div className={Style.cardSection}>
          <Deck/>
          <HandDraw/>
        </div>
      </div>
    </div>
  );
}

export default App;
