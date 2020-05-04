
import React, { useState } from 'react';
import Style from './../../css/Style.module.css';
import Card from './Card';

export default function Deck(){
    const [cardList, setCardList] = useState([1,2,3,4,5,6,7,8,9,10,]);

    function DeckCard(data, index){
        let topShift  = index * -0.04  + "rem";
        let leftShift = index * -0.04  + "rem";
        return (
            <li class={Style.cardDeckItem} 
            style = {{
                top: topShift,
                left: leftShift,
            }}
            key={index} >
                <Card hoverable={false} clickable={false}>{data}</Card>
            </li>
        );  
    }

    return (
        <ul class = {Style.deck}  >
            {cardList.map( 
                (data, index) => DeckCard(data, index)  
            )}    
        </ul>
    );
}
