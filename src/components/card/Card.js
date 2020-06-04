
import React, { useState, useRef } from 'react' ;
import {useSpring, animated} from 'react-spring';
import CardData from './../../data/card/Card';
import Style from './../../css/Style.module.css';
import { useDispatch } from 'react-redux';


/** 
 *  Card Component, including front side and rear side 
*/
let defaultProps = {
    clickable: true,
    hoverable: true,
    card: undefined
}


export default function Card(props=defaultProps){

    const [isFaceDown, setisFaceDown] = useState(false)
    const [isHovered, setisHovered] = useState(false)
    const Card = CardData[props.card];
    const wrapperRef = useRef(null);
    let dispatch = useDispatch();

    const spring = useSpring({
        from: {},
        to: {
            transform:  "scale(1.4)",
            boxShadow: "0 0 0.5rem 0.3rem lightgrey", 
        },
        config: { mass: 4, tension: 500, friction: 10 },
    });


    function flipCard(){
        const wrapper = wrapperRef.current;
        wrapper.classList.toggle(Style.isFlipped);
        setisFaceDown(!isFaceDown);
    }


    function onClick(){
        if (props.clickable){
           
            // flipCard();
        }   
    }



    //let hoverableCard = (hoverable) ? Style.hoverableCard: "";
    return (
        <div class={Style.card} 
            onClick={()=>onClick()} 
            onMouseEnter={() => setisHovered(props.hoverable) } 
            onMouseLeave={() => setisHovered(false)}
        >
            <div class={Style.cardInner} ref = {wrapperRef}  >
                <animated.div 
                class={[Style.frontCard].join(' ')} 
                style={(isHovered && props.hoverable && !isFaceDown) ? spring : {}} 
                >
                    {Card.key}
                </animated.div>
                
                <animated.div 
                class={[ Style.rearCard,].join(' ')} 
                style={{}} 
                >
                    rearCard
                </animated.div>
            </div>
        </div>
    );  
}

