
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
    const [clickable, setclickable] = useState(props.clickable)
    const [hoverable, sethoverable] = useState(props.hoverable)
    const wrapperRef = useRef(null)

    const spring = useSpring({
        from: {},
        to: {
            transform:  "scale(1.6)",
            boxShadow: "0 0 0.5rem 0.3rem lightgrey", 
        },
        config: { mass: 4, tension: 500, friction: 10 },
    });

    function onHover(bool){
        if (hoverable){
            setisHovered(bool);
        }
    }


    function onClick(){
        if (clickable){
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
                onMouseEnter={() => onHover(true) } 
                onMouseLeave={() => onHover(false)}
                style={(isHovered && !isFaceDown) ? spring : {}} 
                >
                    {props.children}
                </animated.div>
                <animated.div 
                class={[ Style.rearCard,].join(' ')} 
                onMouseEnter={() => onHover(true) } 
                onMouseLeave={() => onHover(false)}
                style={ (isHovered && isFaceDown) ? spring : {} } 
                >
                    rearCard
                </animated.div>
            </div>
        </div>
    );  
}

