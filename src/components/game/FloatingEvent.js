
import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {useSpring, animated} from 'react-spring';
import EventData from './../../data/event/Event';
import Style from './../../css/Style.module.css';
import * as Action from '../../state/action/action';


/**
 * Special kind of events that float with a small icon
 * NOTE: Two ways have tried to perform looping of animation (setInterval or async await)
 * Leave them here as a reference
 */
export default function FloatingEvent(props){

    //Loop Animation that periodically rotate
    const rotateStyle = {
        from: {transform: "rotateY(0deg)"},
        to: {transform: "rotateY(360deg)"},
        reset: true,
        config: { mass: 1, tension: 100, friction: 100 },
    }
    const [rotateSpring, setRotateSpring, deleteRotate] = useSpring(() => ( rotateStyle ));


    //Loop Animation going up and down
    const upAndDownSpring = useSpring({
        from: { transform: "translateY(0rem)" },
        to: async next => {
            while(true){
                await next( {transform: "translateY(-0.7rem)"} )
                await next( {transform: "translateY(0rem)"} )
            }  
        },
        reset: true,
        config: { mass: 1, tension: 500, friction: 100 },
    });



    useEffect(() => {
        const loopInterval = setInterval(() => { 
            setRotateSpring(rotateStyle);  
        }, 10000);
        return () => {
            clearInterval(loopInterval);
        }
    }, []);


    return (
        <div class={Style.stageFloatObject }>
            <animated.div style={upAndDownSpring} >
                <animated.div style={rotateSpring} >
                    {props.children}
                </animated.div>
            </animated.div>
            <div class={Style.stageFloatObjectShadow}></div>
        </div>
    )
}
