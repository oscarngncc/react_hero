
import React, { useState, useEffect } from 'react';
import {useSprings, animated} from 'react-spring';
import {useSelector} from 'react-redux';


import Style from './../../css/Style.module.css';




export default function GameBackground(props){
    const particleNum = 6;
    const particleArr = new Array(particleNum).fill(0);
    const isBattle = useSelector(state => state.game.isBattle);
    const [ bgChoice, setbgChoice] = useState(0);

    useEffect(() => {
        setbgChoice( isBattle ? 1 : 2 )
    }, [isBattle])
    

    const snowSprings = useSprings( particleNum, particleArr.map( function(item){ 
        let xStart = Math.floor(Math.random() * 100);
        let yStart = (Math.floor(Math.random() * 20) + 20) * -1;
        let delay = Math.floor(Math.random() * 10000);
        xStart = xStart.toString() + "vw";
        yStart = yStart.toString() + "vh";

        const startStyle = {
            opacity: 0.8, 
            top: yStart,
            left: xStart, 
        }
        return ({
            from: startStyle,
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
                    await next(startStyle);
                }
            },
            reset: true,
            delay: delay,
            config: { mass: 1, tension: 50, friction: 100 },
        });
    }));



    const [laserSprings, setLaser, stopLaser] = useSprings( particleNum, function(index){ 
        let delay = Math.floor(Math.random() * 4000);
        let xStart = Math.floor(Math.random() * 100);
        xStart = "translateX(" + xStart.toString() + "vw)";       
        return({
            from: {
                opacity: 0,
                transform: xStart,
                width: "20rem",
            },
            to: async next => {
                while(true){
                    let xEnd = Math.floor(Math.random() * 100);
                    let width = Math.floor(Math.random() * 8 );
                    xEnd = "translateX(" + xEnd.toString() + "vw)";
                    width = width.toString() + "rem";

                    await next({
                        transform: xEnd,
                        opacity: 0.1,
                        width: width,
                    });
                }  
            },
            config: { mass: 1, tension: 300, friction: 100 },
            reset: true,
            delay: delay,
        });
    });


    const Option = [
        {particle: {}, springs: {}},
        {particle: Style.snowParticle, springs: snowSprings },
        {particle: Style.laserParticle, springs: laserSprings },
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

