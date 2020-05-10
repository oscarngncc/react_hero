
import React, { useState, useRef } from 'react' ;
import {useSpring, animated} from 'react-spring';

import Style from './../../css/Style.module.css';


/** 
 *  Card Component, including front side and rear side 
*/
let defaultProps = {
    clickable: true,
    hoverable: true,
}

export default function Card(props=defaultProps){

    const [name, setname] = useState("Card");
    const [content, setcontent] = useState("Front card")
    const [isFaceDown, setisFaceDown] = useState(false)
    const [isHovered, setisHovered] = useState(false)
    const wrapperRef = useRef(null)

    const spring = useSpring({
        from: {},
        to: {
            transform:  "scale(1.4)",
            boxShadow: "0 0 0.5rem 0.3rem lightgrey", 
        },
        config: { mass: 4, tension: 500, friction: 10 },
    });



    function onClick(){
        if (props.clickable){
            const wrapper = wrapperRef.current;
            wrapper.classList.toggle(Style.isFlipped);
        }
    }

    //let hoverableCard = (hoverable) ? Style.hoverableCard: "";
    return (
        <div class={Style.card} onClick={()=>onClick()} >
            <div class={Style.cardInner} ref = {wrapperRef}  >
                <animated.div 
                class={[Style.frontCard].join(' ')} 
                onMouseEnter={() => setisHovered(props.hoverable) } 
                onMouseLeave={() => setisHovered(false)}
                style={(isHovered && props.hoverable && !isFaceDown) ? spring : {}} 
                >
                    {props.children}
                </animated.div>
                <animated.div 
                class={[ Style.rearCard,].join(' ')} 
                onMouseEnter={() => setisHovered(props.hoverable) } 
                onMouseLeave={() => setisHovered(false)}
                style={ (isHovered && props.hoverable && isFaceDown) ? spring : {} } 
                >
                    rearCard
                </animated.div>
            </div>
        </div>
    );  
}

