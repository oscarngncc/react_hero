

import React, {useState, useRef} from 'react';

import {useSpring, useChain, animated} from 'react-spring';
import Style from './../../css/Style.module.css';

export default function ClickableCircle(props) {

    const [isClick, setisClick] = useState(false);
    
    const fadeSpring = useSpring({
        from: { opacity: 0.1,},
        to: {opacity: 1,},
        reset: true, 
    });
    
    
    return (
        <animated.div class = {Style.clickableCircle} onClick={props.click} style={fadeSpring} >           
        </animated.div>
    )
}
