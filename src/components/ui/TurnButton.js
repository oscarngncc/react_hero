
import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Style from "./../../css/Style.module.css";
import * as Action from './../../state/action/action';
import { useSpring, animated } from 'react-spring';


export default function TurnButton(){

    const dispatch = useDispatch();
    const isBattle = useSelector(state => state.game.isBattle );
    const turn = useSelector(state => state.game.turn);
    const inputLock = useSelector(state => state.game.inputLock );
    const [toggleClick, setToggleClick] = useState(false);
   
    


    const initSpring = useSpring({
        from: { 
            width: (!isBattle) ? "7rem" : "0rem",
            height: (!isBattle) ? "7rem" : "0rem",
        },
        to:{
            width: isBattle? "7rem" : "0rem",
            height: isBattle? "7rem" : "0rem",
        },
        reverse: ! isBattle,
        config: { mass: 3, tension: 500, friction: 50 }
    });


    const clickSpring = useSpring({
        to: (toggleClick) ? {transform: "scale(1.05)",} : {transform: "scale(1)"},
        config: { mass: 2, tension: 2000, friction: 10 }
    });


    /**
     * Perform end-turn based action upon checking current moment is not end-turn
     * NOTE: setInputLock essentially means the duration of entity's turn to move/attack
     * The lock only acciqure here, but unlock and turn update is actually done in Stage instead;
     */
    function onClick(){
        if ( !inputLock ){
            setToggleClick(!toggleClick);
            dispatch(Action.GameStatusAction.setInputLock(true))
        }
    }   

    
    return ( !isBattle) ? <div></div> : (
        <animated.div 
        class={Style.turnButton} 
        style={{
            ...clickSpring,
            ...initSpring,
        }}  
        onClick={() => onClick()} 
        >
            {turn}
        </animated.div>
    );
}

//{`End Turn ${turn}` }
