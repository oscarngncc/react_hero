
import React from 'react';
import Style from "./../../css/Style.module.css";
import EntityData from "./../../data/entity/Entity";
import * as Action from './../../state/action/action';
import { useSelector } from 'react-redux';

import test from "./../../asset/Ghost.png";


export default function Entity(props){
    const key = props.monsterKey;
    const status = useSelector( state => state.game.entitiesStatus[key] );

    const type = status.type;
    const image = require("./../../asset/" + EntityData[type].image.toString());

    

    return (
        <div class={Style.stageObject}>
            <img src={image} class={Style.stageImage} alt={type} ></img>
            <div>{status.health + "/" + status.healthLimit }</div> 
        </div>
    )
}
