import React, {Fragment} from 'react';
import { useSelector } from 'react-redux';


import Style from './css/Style.module.css';
import Stage from './components/game/Stage';
import HandDraw from './components/card/HandDraw';
import StatusBar from './components/ui/CharacterStatusBar';
import AppBar from './components/ui/AppBar';
import Menu from './components/ui/Menu';
import GameBackGround from './components/ui/GameBackGround';
import TopSection from './components/ui/TopSection';
import TurnButton from './components/ui/TurnButton';

import CustomDragLayer from './components/ui/CustomDragLayer';


import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

//import { HTML5Backend } from 'react-dnd-html5-backend'
//import { TouchBackend } from 'react-dnd-touch-backend'



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
              <DndProvider options={HTML5toTouch}> 
                    <TopSection>
                      <StatusBar/>
                      <AppBar/>
                    </TopSection>
                    <CustomDragLayer />
                    <Stage/>
                    <TurnButton/>
                    <div className={Style.cardSection} align="center">
                      {( isBattle ? <HandDraw/> : <div></div> )}
                    </div> 
              </DndProvider>
            )
          }
        </GameBackGround>
      </div>
  );
  
}


export default App;


