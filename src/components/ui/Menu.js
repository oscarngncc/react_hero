

import React, {useState} from 'react'

import Style from './../../css/Style.module.css';
import  * as Action from './../../state/action/action';
import { useDispatch } from 'react-redux';
import { useSpring, animated } from 'react-spring';

export default function Menu(props) {
    let dispatch = useDispatch();
    const [aboutStart, setaboutStart] = useState(false);

    let fadeSpring = useSpring({
        from: {
            opacity: 1,
        },
        to: {
            opacity: (aboutStart) ? 0 : 1,
            transform: (aboutStart) ? "translateY(-3rem)" : "translateY(0rem)" 
        },
        config:  { mass: 4, tension: 600, friction: 200 },
        onRest: () => {startGame()},
    });

    
    function onClickStart(){
        if (!aboutStart) setaboutStart(true);
    }


    function startGame(){
        if (aboutStart){
            let mapLength = 20;
            dispatch(Action.StageAction.generateGamePath( mapLength, 20) );
            dispatch(Action.StageAction.generateEvent(mapLength));
            dispatch(Action.GameStatusAction.startGame(true));
        }
    }

    return (
        <animated.ul class={Style.mainMenu} style={fadeSpring} >
            <li class={Style.mainMenuItem} onClick={() => onClickStart() } >Start Game</li>
            <li class={Style.mainMenuItem} >Card Library</li>
            <li class={Style.mainMenuItem} >Setting</li>
            <li class={Style.mainMenuItem} >About</li>
            <li class={Style.mainMenuItem} >Exit</li>
        </animated.ul>
    );
}
