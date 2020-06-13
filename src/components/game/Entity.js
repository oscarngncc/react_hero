
import React, {useState, useEffect } from 'react';
import Style from "./../../css/Style.module.css";
import EntityData from "./../../data/entity/Entity";
import {GameStatusAction, StageAction} from './../../state/action/action';
import DialogBox from "./../ui/DialogBox";
import {DIRECTION} from './../../state/constant';
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

    //Unique key referring to that entity in the map
    //It also determines which entity to attack first
    const key = props.monsterKey;
    const status = useSelector( state => state.game.statuses[key] );
    const Coord = useSelector( state => state.map.entityInMap[key].Coord );
    const playerCol = useSelector( state => state.map.playerBattleMapCoord.x );
    const inputLock = useSelector( state => state.game.inputLock );
    const attackable = props.attackable && (!inputLock) ;
    const type = status.type;
    const entity = EntityData[type];
    const image = require("./../../asset/entity/" + entity.image.toString());
    const direction = (  playerCol - Coord.x >= 1 ) ? DIRECTION.right: DIRECTION.left;

    const dispatch = useDispatch();
    const [getAttacked, setGetAttacked] = useState(false); 


    /**
     * Toggle Direction
     */
    useEffect(() => {
        if (status.direction !== direction){
            dispatch(Action.GameStatusAction.setEntityDirection(key, direction) );
        }
    }, [direction]);

   
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

    const mirrorStyle = (  direction === DIRECTION.right ) ? Style.mirror : {};  
    //<DialogBox></DialogBox>
    return (
        <EffectWrapper afterEffect={afterEffect} effect={effect} refresh={Math.random()} > 
            <div 
            class={Style.stageObject} 
            onClick={onClickAttack} 
            >
                <img draggable="false" src={image} class={ `${Style.stageImage} ${mirrorStyle} ` } alt={type} ></img>
                <div>{status.health + "/" + status.healthLimit }</div> 
            </div>
        </EffectWrapper> 
    )
}
