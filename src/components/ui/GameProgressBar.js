

import React, {useState, Fragment} from 'react';
import Style from "./../../css/Style.module.css";
import { useSpring, animated } from 'react-spring';
import {useSelector} from 'react-redux';

export default function MapProgress() {

    const isBattle = useSelector(state => state.game.isBattle)
    const playerPos  = useSelector(state => state.map.playerGameMapCoord);
    const map  = useSelector(state => state.map.gameMap);
    const deckList = useSelector(state => state.card.deckList);
    const pileList = useSelector(state => state.card.pileList);
    const cardList = useSelector(state => state.card.cardList );
    const mapSize = (  map !== null && map !== undefined ) ? map[0].length : 0;



    const initSpring = useSpring({
        from: { transform: "translateX(-400rem)" },
        to: { transform: "translateX(0rem)"},
        config:  { mass: 4, tension: 300, friction: 135 },
    });



    function renderLeftBar(){
        if (isBattle){
            return <Fragment>
                <div>{` Deck: ${deckList.length} `}</div>
                <div>{` Pile: ${pileList.length} `}</div>
            </Fragment>
        }
        else {
            return (<Fragment>
            <div>{`Position: ${playerPos.x ?? 0} `}</div>
            <div>{`Map Size: ${mapSize}`}</div>
            <div>{`Level: 1`}</div>
            </Fragment>
            );
        }
    }

    function renderRightBar(){
        if (isBattle){
            return <div></div>
        }
        else {
            return (<Fragment>
                <div>{` Card: ${cardList.length} `}</div>
            </Fragment>);   
        }
    }


    return (
        <animated.div align="center" class={Style.gameProgress} style={initSpring} >
            <div class={Style.gameProgressBar}>{renderLeftBar()}</div>
            <div class={Style.gameProgressBar}>{renderRightBar()}</div>
        </animated.div>
    )
}
