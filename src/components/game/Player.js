

import React from 'react';

import Style from "./../../css/Style.module.css";
import * as Action from './../../state/action/action';
import playerIMG from "./../../asset/Player.png";


export default function Player(){

    return (         
        <div class={Style.stageObject}>
            <img src={playerIMG} class={Style.stageImage} alt="PLAER"></img> 
        </div>
    );
    
}


