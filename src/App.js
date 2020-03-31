import React from 'react';
import Style from './css/Style.module.css';
import Player from './components/entity/Player';
import Monster from './components/entity/Monster';
import HandDraw from './components/card/HandDraw';



function App() {
  return (
    <div className= {Style.app} align="center">
      <div className= {Style.game} align="center" >
        <div className={Style.backgroundIMG}  ></div>
        <Monster/>
        <Player/>
        <HandDraw/>
      </div>
    </div>
  );
}

export default App;
