
import React, {useState, useChain} from 'react';


import Style from './../../css/Style.module.css';
import { useTrail, animated } from 'react-spring';


export default function Stage(props){
    const [gameMap, setgameMap] = useState(
        [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]
    );
     
    const initTrail = useTrail(gameMap.length, {
       from: { transform: "translateY(-50rem)"},
       to: { transform: "translateX(0rem)"},
       config:  { mass: 4, tension: 2000, friction: 140 }
    })



    return (
        <div class={Style.stage} >
            <ul class={Style.gameMap}>
                {gameMap.map((data, index) => {
                    return (
                        <animated.li class={Style.floorUnit} style={ initTrail[index] } >HI</animated.li>
                    );
                })}
            </ul>
        </div>
    );
    
}


