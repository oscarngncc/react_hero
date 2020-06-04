
import React, {useState, useRef, useEffect} from 'react' ;
import {useSpring, useTrail, animated} from 'react-spring';
import Draggable from 'react-draggable';

import { DndProvider } from 'react-dnd';


import * as Action from './../../state/action/action';
import Card from './Card';
import CardData from './../../data/card/Card';
import Style from './../../css/Style.module.css';
import { useSelector, useDispatch } from 'react-redux';


//import { connect } from 'react-redux';


export default function HandDraw(props){

    const dispatch = useDispatch();

    const defaultPos = {x: 0, y: 0};
    const noDragIndex = -1;

    const cardList = useSelector(state => state.card.handList);
    const [dragIndex, setDragIndex] = useState(noDragIndex);
    const [isProtrait, setisProtrait] = useState(window.innerHeight / window.innerWidth > 1 ? true : false);

    //Check Redraw
    if (cardList.length === 0){
        dispatch(Action.CardAction.drawCard(4));
    }


    useEffect(() => {
        window.addEventListener("resize", ()=>{  setisProtrait(window.innerHeight / window.innerWidth > 1 ? true : false)   });
        return () => {
            window.removeEventListener("resize", ()=>{} );
        }
    });


    const hoverSpring = useSpring({
        from : {opacity: 1},
        to: { opacity: 0 },
    });
    const [initTrail, setInitTrail] = useTrail(cardList.length, function(){
        return {
            from: { 
                transform: "translate(-10rem, 30rem)",
                opacity: 0.6, 
            },
            to: {
                transform: "translate(0, 0)", 
                opacity: 1.0,
            },
            config:  { mass: 2, tension: 600, friction: 55 }
        };
    });



    /** 
     * use the card, including using its effect and discard it
     * @param {number} index index of the card in your hand
    */
    function consumeCard(index){
        const Card = CardData[ cardList[index] ];
        let usable = true;

        for (var condition in Card.effect ){

        }
        if (!usable){
            return;
        }
        for (var action in Card.effect ){
            dispatch( Card.effect[action] );
        }
    }


    /**
     * When card being dragged
     * @param {*} index 
     */
    function onDragStart(index){
        if (index !== dragIndex){
            setDragIndex(index);
        }
    }

    /**
     * When card is no longer dragged
     * @param {*} index 
     */
    function onDragEnd(index){
        setDragIndex(-1);
        consumeCard(index)
    }



    /**
     * Function responsible for setting up the style of idle card position (both portrait/landscape)
     * @param {*} index --index of the card
     */
    function idleCardPosition(index){

        if (dragIndex === index) 
            return {};

        if (isProtrait){
            const layer = 2; 
            const cardsPerLayer = 4;  
           
            let distance = ( -4 / cardList.length).toFixed(1).toString();
            let dynamicMargin = "0rem " + distance + "rem";
            let topDist="";

            if (cardList.length <= cardsPerLayer ){
                topDist="-12rem";
            } else {
                if (index < cardsPerLayer ){
                    topDist="0rem";
                }
                else { 
                    topDist="-7.5rem";
                }
            }


            return {
                top: topDist,
                margin: dynamicMargin,
            };
        }

        const middle = Math.floor(cardList.length / 2);
        const rotateDegree = 2;
        const topDistance = 0.85;
        
        let distance = ( -3 / cardList.length).toFixed(1).toString();
        
        let dynamicMargin = "0rem " + distance + "rem";
        let elevation = "";
        let topDist = "";
        
        if ( index === middle ){
            elevation = "rotate("+ rotateDegree/2 +"deg)"
            topDist =  (topDistance / 2) + "rem";
        }
        else { 
            elevation = "rotate(" + (-(middle-index) * rotateDegree).toString() + "deg)";
            topDist = ( topDistance * Math.abs((middle-index))).toString()  + "rem";
        }

        return {
            margin: dynamicMargin,
            transform: elevation,
            top: topDist,
        };
    }


    /**
     * Render card item
     * @param {*} data 
     * @param {*} index index of the card
     */
    function  renderCardListItem(data, index ) {

        let hoverable = (dragIndex === index) ? false:  true;
        
        return (
            <li 
            class = {Style.cardListItem}
            style = {{...idleCardPosition(index)}} 
            key={index}>
                <animated.div 
                style={{ ...initTrail[index] } }
                >
                    <Draggable
                    position={defaultPos}
                    onStart={() => onDragStart(index)}
                    onStop={(_event, data) => onDragEnd(index)}
                    >
                        <div>
                            <Card clickable={true} hoverable={hoverable} card={cardList[index] }  ></Card>
                        </div>
                    </Draggable>
                </animated.div>
            </li>
        );
   }


   return (
    <ul class={Style.handDraw}>
        {cardList.map( 
            (data, index) => renderCardListItem(data, index)  
        )}
    </ul>
    );
    
}

