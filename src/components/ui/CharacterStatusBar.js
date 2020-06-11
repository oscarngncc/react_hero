
import React from 'react';
import Style from "./../../css/Style.module.css";
import {PLAYER_ID} from "./../../state/constant";
import { useSelector} from 'react-redux';
import { useSpring , animated } from 'react-spring';


export default function CharacterStatusBar(){
    
    const HP = useSelector(state => state.game.statuses[PLAYER_ID].health);
    const MaxHP = useSelector(state => state.game.statuses[PLAYER_ID].healthLimit);
    const Money = useSelector(state => state.game.money);


    
    let healthPercent = Math.floor(HP/MaxHP * 100).toString() + "%";
    const healthBarSpring = useSpring({
        from: {width: "0%" },
        to: { width: healthPercent, }
    });

    
    return (
    <div class={Style.statusBar} >
       <div class={Style.statusParallelogram} >
            <p>Money: {Math.round(Money)}</p>
            <p>Some Filler</p>
       </div>
       <div class={Style.healthBarParallelogram} >
           <animated.div class={Style.healthBarFill} style={healthBarSpring} ></animated.div>
        </div>  
    </div>
    );
}

