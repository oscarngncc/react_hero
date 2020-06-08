
import React, {useState} from 'react';
import Style from "./../../css/Style.module.css";
import EntityData from "./../../data/entity/Entity";

import * as Action from './../../state/action/action';
import { useSelector, useDispatch } from 'react-redux';

import EffectWrapper from './EffectWrapper';


/**
 * functional class components referring entities (enemies) in Battle
 * contain image, information about the entity itself
 * @returns HTML JSX-object
 * @param {*} props 
 */
export default function Entity(props){
    
    const dispatch = useDispatch();
    const [getAttacked, setGetAttacked] = useState(false);


    //Unique key referring to that entity in the map
    const key = props.monsterKey;
    const attackable = props.attackable;
    const status = useSelector( state => state.game.entitiesStatus[key] );
    const type = status.type;
    const image = require("./../../asset/" + EntityData[type].image.toString());


   
    /**
     * Trigger Attack effect
     */
    function onClickAttack(){
        if ( attackable && getAttacked === false  ){
            setGetAttacked(true);
        }
    }


    /**
     * Function passed to effect wrapper to trigger the actual effect
     * NOTE: only get executed after timeout
     */
    const afterEffectAttack = () => {
        console.log("after");
        setGetAttacked(false);
        dispatch(Action.GameStatusAction.incrementStep(-1));
        dispatch(Action.GameStatusAction.playerAttack(key) );
    }



    let afterEffect = null;
    let effect = null;
    
    if (getAttacked){ 
        afterEffect = afterEffectAttack;  
        effect= "Attack.gif";
    }


    return (
        <EffectWrapper afterEffect={afterEffect} effect={effect} > 
            <div 
            class={Style.stageObject} 
            onClick={onClickAttack} 
            >
                <img draggable="false" src={image} class={[ Style.stageImage ].join('') } alt={type} ></img>
                <div>{status.health + "/" + status.healthLimit }</div> 
            </div>
        </EffectWrapper> 
    )
}
