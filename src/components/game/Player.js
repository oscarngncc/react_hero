

import React from 'react';

import Style from "./../../css/Style.module.css";
import * as Action from './../../state/action/action';
import playerIMG from "./../../asset/entity/Player.png";
import { useSelector, useDispatch } from 'react-redux';
import * as Constant from './../../state/constant';
import EffectWrapper from './EffectWrapper';
import {PLAYER_ID} from './../../state/constant';


export default function Player(){
    const dispatch = useDispatch();
    const isBattle = useSelector(state => state.game.isBattle);
    const steps = useSelector(state => state.game.steps );
    const stepsLimit = useSelector(state => state.game.statuses[PLAYER_ID].stepsLimit );
    const direction = useSelector(state => state.game.statuses[PLAYER_ID].direction );
    const mirrorClass = ( direction === Constant.DIRECTION.left && isBattle ) ? Style.mirror : {};
    
    //Change Player Direction upon click
    function onClick(){
        if (isBattle){
            dispatch(Action.GameStatusAction.togglePlayerDirection());
        }
    }


    return (        
        <EffectWrapper>
            <div class={Style.stageObject}>
                <img draggable="false" 
                src={playerIMG} 
                class={`${Style.stageImage} ${mirrorClass}` } 
                alt="PLAYER" 
                onClick={() => onClick() }
                />
                {(isBattle) ? <div>{steps}</div> : <div></div> } 
            </div>
        </EffectWrapper> 
    );
    
}


