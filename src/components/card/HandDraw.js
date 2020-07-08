
import React, {useState, useRef, useEffect} from 'react' ;
import {useTransition, useTrail, animated} from 'react-spring';

import * as Action from './../../state/action/action';
import * as Constant from './../../state/constant';
import Card from './Card';
import CardData from './../../data/card/Card';
import Style from './../../css/Style.module.css';
import { useSelector } from 'react-redux';

import { useDragLayer } from 'react-dnd'

//window.innerHeight / window.innerWidth > 1 &&

export default function HandDraw(){
    const inputLock = useSelector(state => state.game.inputLock);
    const cardList = useSelector(state => state.card.handList);
    const [isProtrait, setisProtrait] = useState( ( window.innerWidth < window.innerHeight )  ? true : false);
    
    
    useEffect(() => {
        window.addEventListener("resize", ()=>{  setisProtrait(
            (  window.innerWidth < window.innerHeight ) 
        ? true : false)});    
        return () => {
            window.removeEventListener("resize", ()=>{} );
        }
    });


    //Detect whether dragging is happening
    const { item, isDragging } = useDragLayer((monitor) => ({
        isDragging: monitor.isDragging(),
        item: monitor.getItem(),
    }));
    

    const hideCard = { transform: "translate(-10rem, 30rem)", opacity: 0.6,  };
    const showCard = { transform:  "translate(0, 0)", opacity: 1.0, };
    const [initTrail, setInitTrail] = useTrail( cardList.length, function(){
        return {
            from: hideCard,
            to: showCard,
            config:  { mass: 2, tension: 600, friction: 55 },
            reset: false,
        };
    });

    useEffect(() => {
        if (inputLock){
            setInitTrail( {from: showCard, to: hideCard} );
        } else {
            setInitTrail( {from: hideCard, to: showCard} );
        }
    }, [inputLock])

    


    /**
     * Function responsible for setting up the style of idle card position (both portrait/landscape)
     * @param {*} index --index of the card
     */
    function idleCardPosition(index){

        if (isProtrait){
            const layer = Constant.HAND_LAYER; 
            const cardsPerLayer = Constant.CARD_PER_HAND_LAYER ;  
           
            let distance = ( -5 / cardList.length);
            if (isDragging && index === item.index ){
                distance += 2;
            }
            let dynamicMargin = `0rem ${distance}rem`;
            let topDist="";

            //Only One Layer
            if (cardList.length <= cardsPerLayer ){
                topDist="-12rem";
            } 
            //More than one layer (i.e. 2)
            else {
                if (index < cardsPerLayer ){
                    //TOP
                    topDist="-5rem";
                }
                else { 
                    //DOWN
                    topDist="-12rem";
                }
            }

            return {
                top: topDist,
                margin: dynamicMargin,
            };
        }

        const middle = Math.floor(cardList.length / 2);
        const rotateDegree = 2;
        let topDistance = 0.85;
        
        let distance = ( -3 / cardList.length);
        if (isDragging && index === item.index ){
            distance += 2;
            topDistance += -2; 
        }
        
        let dynamicMargin = `0rem ${distance}rem`;
        let elevation = "";
        let topDist = "";
        
        if ( index === middle ){
            elevation = `rotate(${rotateDegree/2}deg)`;
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
        let animation = (true) ? initTrail[index] : {}; 
        return (
            <li 
            class = {Style.cardListItem}
            style = {{...idleCardPosition(index)}} 
            key={index}
            >
                <animated.div 
                style={{  ...animation  } }
                >
                    <div>
                        <Card 
                        clickable={!inputLock} 
                        hoverable={true} 
                        draggable={!inputLock}
                        index={index}
                        card={cardList[index] } 
                        />
                    </div>
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


