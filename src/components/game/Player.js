

import React from 'react';

import Style from "./../../css/Style.module.css";
import * as Action from './../../state/action/action';
import playerIMG from "./../../asset/Player.png";
import { useSelector } from 'react-redux';

import EffectWrapper from './EffectWrapper';


export default function Player(){
    const isBattle = useSelector(state => state.game.isBattle);
    const steps = useSelector(state => state.game.steps );
    const stepsLimit = useSelector(state => state.game.stepsLimit );

    return (        
        <EffectWrapper>
            <div class={Style.stageObject}>
                <img draggable="false" src={playerIMG} class={Style.stageImage} alt="PLAER"></img> 
                {(isBattle) ? <div>{steps}</div> : <div></div> } 
            </div>
        </EffectWrapper> 
    );
    
}


