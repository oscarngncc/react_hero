
import React from 'react';
import { useDispatch } from 'react-redux';
import {useSpring, animated} from 'react-spring';
import EventData from './../../data/event/Event';
import Style from './../../css/Style.module.css';
import * as Action from '../../state/action/action';


export default function Event({eventKey}){
    const dispatch = useDispatch();
    const event = EventData[eventKey];
    const image = require("./../../asset/event/" + event.image );

    function triggerBattle(){
        dispatch(Action.GameStatusAction.startBattle(true));
    }

    const defaultCSS = {transform: "rotateY(0deg)"}

    /*
    const [rotateSpring, set, stop] = useSpring( () => ({
        from: defaultCSS,
        to: async (next) => { 
            while (1){
                await next({transform: "rotateY(360deg)"});
            }
        },
        delay: 200,
    }));
    */

    return (
        <div class={Style.stageObject} onClick={() => triggerBattle()}>
            <animated.div style={{}} >
                <img draggable="false" src={image} class={ `${Style.stageImage}` } alt={"Event"} />
            </animated.div>
        </div>
    );
}
