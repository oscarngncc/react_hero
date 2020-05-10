
import React, { useState, Fragment } from 'react'
import {animated, useSprings} from 'react-spring'
import ModalWindow from './ModalWindow';

import Style from "./../../css/Style.module.css";


export default function AppBar(props){
    

    const contents = ["News", "Status", "Setting"];
    const [areItemsOn, setItemsOn] = useState(new Array(contents.length).fill(false));
    const [areItemsHover, setItemsHover] = useState(new Array(contents.length).fill(false));
    
    const springProps = useSprings(areItemsHover.length, areItemsHover.map( item =>
        ({
            opacity: item ?  0.5 : 1,
        })
    ));


    function setItemOn(index, bool){
        let newItemsOn = [...areItemsOn];
        newItemsOn[index] = bool;
        setItemsOn(newItemsOn);
    }

    function setItemHover(index, bool, bug){
        console.log(bug);
        let newItemsHover = [...areItemsHover];
        newItemsHover[index] = bool;
        setItemsHover(newItemsHover);
    }

    return (
        <ul class={Style.appBar}>
            {springProps.map( ( springProp, index) =>(
                <Fragment key={contents[index]}>
                    <animated.li 
                    style={springProp} 
                    onClick={() => setItemOn(index, true)} 
                    onMouseEnter={()=>setItemHover(index, true, springProp)} 
                    onMouseLeave={()=>setItemHover(index, false)} 
                    >
                        {contents[index]}
                    </animated.li>
                    <li>
                        <ModalWindow isOpen={areItemsOn[index]} unmount={ () => setItemOn(index,false)}>
                            <h1>{contents[index]}</h1>
                        </ModalWindow>
                    </li>
                </Fragment>
            ))}
        </ul>
    );
}

