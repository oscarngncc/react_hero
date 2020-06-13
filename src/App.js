import React, {Fragment} from 'react';
import { useSelector } from 'react-redux';


import Style from './css/Style.module.css';
import Stage from './components/game/Stage';
import BattleStage from './components/game/BattleStage';
import HandDraw from './components/card/HandDraw';
import StatusBar from './components/ui/CharacterStatusBar';
import AppBar from './components/ui/AppBar';
import Menu from './components/ui/Menu';
import GameBackGround from './components/ui/GameBackGround';
import TopSection from './components/ui/TopSection';
import TurnButton from './components/ui/TurnButton';
import CustomDragLayer from './components/ui/CustomDragLayer';
import MapProgressBar from './components/ui/GameProgressBar';


function App() {
  const startGame = useSelector(state => state.game.startGame);
  const isBattle = useSelector(state => state.game.isBattle);
  
  
  /*
  return (<div className={Style.game} align="center" >
      <MapProgressBar/>  
    </div>
  );
  */
  
  
  return (
      <div className={Style.app} align="center">    
        <GameBackGround align="center">
        {(!startGame) ? 
          (
            <Fragment>
              <Menu/>
            </Fragment>
          ): 
          (
            <Fragment>
              <TopSection>
                <StatusBar/>
                <AppBar/>
              </TopSection>
              <CustomDragLayer />
              <Stage></Stage> 
              {(isBattle) ? <BattleStage><TurnButton/></BattleStage> : <div></div> }
              <MapProgressBar/>
              {(isBattle) ? <div className={Style.cardSection} align="center"><HandDraw/></div> : <div></div>  }              
            </Fragment>
          )
        }
        </GameBackGround>
      </div>
  );
  
}


export default App;



// <GameBackGround align="center"></GameBackGround>