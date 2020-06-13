

import React, {useState} from 'react';
import CardData from './../../data/card/Card';
import EntityData from './../../data/entity/Entity'
import Style from './../../css/Style.module.css';
import Card from './../card/Card';
import Entity from '../game/Entity';
import {useSpring, animated} from 'react-spring';

export default function Library() {
    const [listChoice, setlistChoice] = useState(1);
    var Preload = require('react-preload').Preload;


    //Loop Animation going up and down
    const upAndDownSpring = useSpring({
        from: { transform: "translateY(0rem)", float: "left" },
        to: async next => {
            while(true){
                await next( {transform: "translateY(-0.7rem)"} )
                await next( {transform: "translateY(0rem)"} )
            }  
        },
        reset: true,
        config: { mass: 1, tension: 500, friction: 60 },
    });


    function renderEntityChild(key){
        const entity = EntityData[key];
        const image= require("./../../asset/entity/" + entity.image);
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        return (
            <li key={key} >
                <div class={Style.libraryItem} >
                    <animated.div class={ `${Style.stageObject}`} style = {upAndDownSpring} >
                        <img src={image} class={Style.stageImage} alt={key} />
                    </animated.div>
                    <p>{`Name: ${name ?? '' }`}</p>
                    <p>{`Health: ${entity.health ?? 0 }`}</p>
                    <p>{`Attack: ${entity.attack ?? 0 }`}</p>
                </div>
            </li>
        )
    }


    function renderCardChild(key){
        const card = CardData[key];
        const effectUrl= require("./../../asset/particles/" + card.particle);
        return (
            <li key={key} >
                <div class={Style.libraryItem} >
                    <div style = {{ float: "left"}} >
                        <Card 
                        clickable={false} 
                        hoverable={false} 
                        draggable={false}
                        card={ key } 
                        /> 
                    </div>
                    <p>{ CardData[key].key }</p>
                    <img src={effectUrl} class={Style.effectInLibrary} alt={""} onClick={() => {}} />
                </div>
            </li>
        );
    }


    function renderChild(key){
        switch (listChoice){
            case 0: return renderCardChild(key);
            case 1: return renderEntityChild(key);
            default: return <div></div>;
        }
    }


    function chosenList(option){
        switch (listChoice){
            case 0: return CardData;
            case 1: return EntityData;
            default: return [];
        }
    }

    const choosedList = chosenList(listChoice);

    return (
        <div class={Style.library} >
            <ul class = {Style.librarySelection}>
                <li class={Style.selectionTab} onClick={() => setlistChoice(0)} >Card List</li>
                <li class={Style.selectionTab} onClick={() => setlistChoice(1)} >Entity List</li>
                <li class={Style.selectionTab} onClick={() => setlistChoice(2)} >Event List</li>
            </ul>
            <ul class={Style.libraryItemSection}>
                { Object.keys(choosedList).map((key, index) => renderChild(key) )}
            </ul>
        </div>
    )
}
