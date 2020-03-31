import React from 'react';
import Style from './css/Style.module.css';
import Player from './components/entity/Player';



function App() {
  return (
    <div className= {Style.app} align="center">
      <div className= {Style.game} align="center" >
        <div className={Style.backgroundIMG} ></div>
        <Player/>
        <Player/>
      </div>
    </div>
  );
}

export default App;
