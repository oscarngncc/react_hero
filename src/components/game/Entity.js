
import React from 'react';
import Style from "./../../css/Style.module.css";
import EntityData from "./../../data/entity/Entity";

import * as Action from './../../state/action/action';
import { useSelector, useDispatch } from 'react-redux';

import test from "./../../asset/Ghost.png";


/**
 * functional class components referring entities (enemies) in Battle
 * contain image, information about the entity itself
 * @returns HTML JSX-object
 * @param {*} props 
 */
export default function Entity(props){
    let dispatch = useDispatch();
    
    //Unique key referring to that entity
    const key = props.monsterKey;
    const attackable = props.attackable;
    const status = useSelector( state => state.game.entitiesStatus[key] );

    const type = status.type;
    const image = require("./../../asset/" + EntityData[type].image.toString());

    const attackableStyle = (attackable) ? Style.attackableEntity : '';


    /**
     * onClickEvent to Attack
     */
    function onClickAttack(){
        if ( attackable ){
            dispatch(Action.GameStatusAction.incrementStep(-1));
            dispatch(Action.GameStatusAction.playerAttack(key) );
        }
    }


    return (
        <div class={Style.stageObject} 
        onClick={onClickAttack} 
        >
            <img draggable="false" src={image} class={[ Style.stageImage ].join('') } alt={type} ></img>
            <div>{status.health + "/" + status.healthLimit }</div> 
        </div>
    )
}
