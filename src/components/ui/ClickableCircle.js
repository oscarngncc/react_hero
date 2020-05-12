

import React from 'react';

import {useSpring, animated} from 'react-spring';
import Style from './../../css/Style.module.css';

export default function ClickableCircle(props) {

    /*
    const loopSpring = useSpring({
        from: {
            opacity: 0,
        },
        
        to: async next => {
            while(true){
                await next({
                    opacity: 1,
                });
            }  
        },
        reset: true,     
    })
    */
    

    return (
        <animated.div class = {Style.clickableCircle} onClick={props.click} style={{}} >            
        </animated.div>
    )
}
