
import React, { useState } from 'react';
import {useSprings, animated} from 'react-spring';


import Style from './../../css/Style.module.css';

export default function GameBackground(props){
    const particleNum = 30;
    const particleArr = new Array(particleNum).fill(0);
    const [ bgChoice, setbgChoice] = useState(0);


    const snowSprings = useSprings(particleNum, particleArr.map( function(item){ 
        let xStart = Math.floor(Math.random() * 100);
        let yStart = (Math.floor(Math.random() * 20) + 20) * -1;
        let delay = Math.floor(Math.random() * 5000);
        xStart = xStart.toString() + "vw";
        yStart = yStart.toString() + "vh";
        return ({
            from: {
                opacity: 0.8, 
                top: yStart,
                left: xStart, 
            },
            to: async next => {
                while(true){
                    let xEnd = Math.floor(Math.random() * 100);
                    let yEnd = Math.floor(Math.random() * 20) + 80;
                    xEnd = xEnd.toString() + "vw";
                    yEnd = yEnd.toString() + "vh";

                    await next({
                        opacity: 0,
                        top: yEnd, 
                        left: xEnd,
                    });
                }
            },
            reset: true,
            delay: delay,
            config: { mass: 1, tension: 50, friction: 100 },
        });
    }));


    const laserSprings = useSprings(particleNum, particleArr.map( function(item, index){ 
        let delay = Math.floor(Math.random() * 4000);
        let xStart = Math.floor(Math.random() * 100);
        xStart = xStart.toString() + "vw";
        
        return({
            from: {
                opacity: 0,
                left: xStart,
                width: "20rem",
            },
            to: async next => {
                while(true){
                    let xEnd = Math.floor(Math.random() * 100);
                    let width = Math.floor(Math.random() * 8 );
                    xEnd = xEnd.toString() + "vw";
                    width = width.toString() + "rem";

                    await next({
                        left: xEnd,
                        opacity: (index%6===0) ? 0.1 : 0,
                        width: width,
                    });
                }  
            },
            config: { mass: 1, tension: 300, friction: 100 },
            reset: true,
            delay: delay,
        });
    }));


    const Option = [
        {particle: Style.snowParticle, springs: snowSprings },
        {particle: Style.laserParticle, springs: laserSprings },
        {particle: {}, springs: {}},
    ];


    function renderParticle(index){
        return (
            <animated.div key={"particle" + index.toString()}
            class={Option[bgChoice].particle} 
            style={Option[bgChoice].springs[index]} >
            </animated.div>
        );
             
    }


    return (
    <div className= {Style.game} >
        {particleArr.map((_, index) => renderParticle(index) ) }
        {props.children}
    </div>
    );
} 