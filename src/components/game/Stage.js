
import React, {useState} from 'react';
import { useTrail, animated } from 'react-spring';

import Style from './../../css/Style.module.css';
import PositionComponent from './../misc/PositionComponent';



export default function Stage(props){
    const [gameMap, setgameMap] = useState(
        [
            [0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0,],
        ]
    );
    const renderMap = [].concat.apply([], gameMap);
     

    const initTrail = useTrail(renderMap.length, {
       from: { transform: "translateY(-150rem)"},
       to: { transform: "translateX(0rem)"},
       config:  { mass: 4, tension: 2000, friction: 140 }
    })


    return (
        <div class={Style.stage}>
            <div class={Style.gameMap} >
                <ul class={Style.tileMap}>
                    {renderMap.map((data, index) => {
                        return (
                            <animated.li 
                            class={Style.floorUnit}
                             key={"tile" + index.toString()} 
                            style={ initTrail[index] }
                            >
                                    <div>HI</div>
                            </animated.li> 
                        );
                    })}
                </ul>
            </div>
        </div>
    );
    
}


