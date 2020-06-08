

import React, {useState, useEffect} from 'react';
import {useSpring, animated} from 'react-spring';
import Style from './../../css/Style.module.css';

export default function EffectWrapper(props) {

    
    const effectUrl = (props.effect !== undefined && props.effect !== null ) ? require("./../../asset/particles/" + props.effect.toString()) : null;
    const effectIMG = (effectUrl === null ) ? <div></div> : (
        <img src={effectUrl + `?a=${props.refresh}` }  class={Style.stageParticle} alt={props.effect.toString()} />
    );
    

   const spring = useSpring({
    from: { transform: "translateY(-1rem)", opacity: 0.7 },
    to: {transform: "translateY(0rem)", opacity: 1 },
  })


    /**
     * run Special Effect, if after effect provided
     */
    function runEffect(){
        if (props.afterEffect !== undefined && props.afterEffect !== null ){
            setTimeout(() => {
                props.afterEffect();
            }, 200);
        }
    }
    runEffect();


    return (
        <animated.div style={spring}>
            <div class={Style.effect} >
                {effectIMG}
            </div>
            <div>{props.children}</div>
        </animated.div>
    )
}
