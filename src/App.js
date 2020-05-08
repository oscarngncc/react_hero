import React from 'react';
import Style from './css/Style.module.css';
//import Player from './components/game/Player';
import Stage from './components/game/Stage';
//import EntityStage from './components/game/EntityStage';
import HandDraw from './components/card/HandDraw';
//import Deck from './components/card/Deck';
import StatusBar from './components/ui/CharacterStatusBar';
import AppBar from './components/ui/AppBar';
import PositionalComponent from './components/misc/PositionComponent';
import GameBackGround from './components/ui/GameBackGround';

function App() {
  return (
    <div className= {Style.app} align="center">
      <GameBackGround align="center">
        <AppBar/>
        <PositionalComponent positionKey="Stage"></PositionalComponent><Stage/>
        <StatusBar />
        <div className={Style.cardSection} align="center">
          <HandDraw/>
        </div>
      </GameBackGround>
    </div>
  );
}

/*
function App() {
  return (
    <div className= {Style.app} align="center">
      <GameBackGround align="center">
        <AppBar/>
        <PositionalComponent positionKey="Stage"><Stage/></PositionalComponent>
        <StatusBar />
        <div className={Style.cardSection} align="center">
          <HandDraw/>
        </div>
      </GameBackGround>
    </div>
  );
}
*/

export default App;
