
import React from 'react';
import Style from "./../../css/Style.module.css";

import { useSelector } from 'react-redux';


export default function CharacterStatusBar(){
    
    const HP = useSelector(state => state.game.health);
    const MaxHP = useSelector(state => state.game.healthLimit);
    const Money = useSelector(state => state.game.money);
    const Hour = useSelector(state => state.game.time);
    
    return (
    <div class={Style.statusBar} >
        <ul>
            <li class={Style.statusBarItem}>HP: {Math.round(HP)}/{Math.round(MaxHP)}</li>
            <li class={Style.statusBarItem}>Money: {Math.round(Money)}</li>
            <li class={Style.statusBarItem}>Time: {Math.round(Hour) + ": 00"}</li>              
        </ul>
    </div>
    );
}

