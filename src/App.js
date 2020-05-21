import React, {useState, Fragment} from 'react';
import { useSelector } from 'react-redux';

import Style from './css/Style.module.css';
import Stage from './components/game/Stage';
import HandDraw from './components/card/HandDraw';
import StatusBar from './components/ui/CharacterStatusBar';
import AppBar from './components/ui/AppBar';
import Menu from './components/ui/Menu';
import GameBackGround from './components/ui/GameBackGround';
import TopSection from './components/ui/TopSection';


function App() {

  let startGame = useSelector(state => state.game.startGame);
  let isBattle = useSelector(state => state.game.isBattle);
  
  //return (<div className={Style.game}></div>);


  
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
            
            <TopSection>
              <StatusBar/>
              <AppBar/>
            </TopSection>

            <Stage/>

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


