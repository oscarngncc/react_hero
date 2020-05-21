
import React, {useState, useRef, useEffect} from 'react' ;
import {useSpring, useTrail, animated} from 'react-spring';
import Draggable from 'react-draggable';

import Card from './Card';
import Style from './../../css/Style.module.css';


//import { connect } from 'react-redux';


export default function HandDraw(props){

    const defaultPos = {x: 0, y: 0};
    const noDragIndex = -1;


    //const cardRefs = useRef([]);
    const [cardList, setcardList] = useState([1,2,3,4,5,6,7,8]);
    const [dragIndex, setDragIndex] = useState(noDragIndex);
    const [isProtrait, setisProtrait] = useState(window.innerHeight / window.innerWidth > 1 ? true : false);

    useEffect(() => {
        window.addEventListener("resize", ()=>{  setisProtrait(window.innerHeight / window.innerWidth > 1 ? true : false)    });
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


    function onDragStart(index){
        if (index !== dragIndex){
            setDragIndex(index);
        }
    }


    function onDragEnd(data){
        setDragIndex(-1);
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

            if (index < cardsPerLayer ){
                //topDist="15rem";
                topDist="0rem";
            }
            else { 
                //topDist="5rem";
                topDist="-7.5rem";
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
                    onStop={(_event, data) => onDragEnd(data)}
                    >
                        <div>
                            <Card  clickable={false} hoverable={hoverable} ></Card>
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

