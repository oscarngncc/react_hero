import React from 'react';
import Style from './css/Style.module.css';
//import Player from './components/entity/Player';
import Stage from './components/entity/Stage';
import HandDraw from './components/card/HandDraw';
import Deck from './components/card/Deck';
import StatusBar from './components/ui/CharacterStatusBar';
import AppBar from './components/ui/AppBar';
import PositionalComponent from './components/misc/PositionComponent';


function App() {
  return (
    <div className= {Style.app} align="center">
      <div className= {Style.game} align="center" >
        <AppBar/>
        <div className={Style.backgroundIMG}  ></div>
        <PositionalComponent positionKey="Stage"><Stage/></PositionalComponent>
        <StatusBar />
        <div className={Style.cardSection} align="center">
        <PositionalComponent positionKey="Deck"><Deck/></PositionalComponent>
          <HandDraw/>
        </div>
      </div>
    </div>
  );
}

export default App;
