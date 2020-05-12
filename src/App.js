import React, {useState, Fragment} from 'react';
import { useSelector } from 'react-redux';

import Style from './css/Style.module.css';
//import Player from './components/game/Player';
import Stage from './components/game/Stage';
//import GameMap from './components/game/GameMap';
//import EntityStage from './components/game/EntityStage';
import HandDraw from './components/card/HandDraw';
//import Deck from './components/card/Deck';
import StatusBar from './components/ui/CharacterStatusBar';
import AppBar from './components/ui/AppBar';
import Menu from './components/ui/Menu';
import PositionalComponent from './components/misc/PositionComponent';
import GameBackGround from './components/ui/GameBackGround';


function App() {

  let startGame = useSelector(state => state.game.startGame);
  let isBattle = useSelector(state => state.game.isBattle);
  
  return (
    <div className={Style.app} align="center">
    <GameBackGround align="center">
      {
        (!startGame) ? 
        (
          <Menu/>
        ): 
        (
          <Fragment>
            <StatusBar/>
            <AppBar/>
            <PositionalComponent positionKey="Stage"></PositionalComponent><Stage/>
            <div className={Style.cardSection} align="center">
              {( isBattle ? <HandDraw/> : <div></div> )}
            </div>            
          </Fragment>
        )
      }
    </GameBackGround>
    </div>
  );
  
}


export default App;
