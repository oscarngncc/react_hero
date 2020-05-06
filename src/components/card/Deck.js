
import React, { useState } from 'react';
import Style from './../../css/Style.module.css';
import Card from './Card';
import { useSpring, animated } from 'react-spring';

export default function Deck(){
    const [cardList, setCardList] = useState([0,1,2,3,4,5,6,7,8,9]);
    const [isClick, setisClick] = useState(false);
    
    const downDismissSpring = useSpring({
        top: isClick  ? "12rem" : "0rem",
        opacity: isClick  ? "0" : "1",
        config: { mass: 1, tension: 170, friction: 26 },
        onRest: () => onClickCallBack(),
    });

    function onClickCallBack(){
        if (isClick == true){
            let newCardList = cardList;
            newCardList.pop();
            setCardList(newCardList);
            setisClick(false);
        }
    }
    

    function DeckCard(data, index){
        let spring = ( isClick && index == cardList.length-1) ? downDismissSpring : {};
        let topShift  = index * -0.04  + "rem";
        let leftShift = index * -0.04  + "rem";
        return (
            <animated.li 
            class={Style.cardDeckItem} 
            style = {{
                top: topShift,
                left: leftShift,
                ...spring,
            }}
            key={index} >
                <Card hoverable={false} clickable={false}>{index}</Card>
            </animated.li>
        );  
    }

    return (
        <ul class = {Style.deck} onClick={()=> setisClick(true)}  >
            {cardList.map( 
                (data, index) => DeckCard(data, index)  
            )}    
        </ul>
    );
}
