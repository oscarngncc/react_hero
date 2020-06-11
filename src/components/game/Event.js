
import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {useSpring, animated} from 'react-spring';
import EventData from './../../data/event/Event';
import Style from './../../css/Style.module.css';
import * as Action from '../../state/action/action';
import FloatingEvent from './FloatingEvent';


export default function Event({eventKey}){
    const dispatch = useDispatch();
    const event = EventData[eventKey];
    const image = require("./../../asset/event/" + event.image );
    const action = event.action;
    const isFloatingEvent = event.isFloat ?? false;


    function trigger(){
        if (action !== undefined ){
            dispatch( action() );
        }
    }
    
    
    const renderImage = <img draggable="false" src={image} class={ `${Style.stageImage}` } alt={"Event"}/>;
    const renderEvent = (isFloatingEvent) ? <FloatingEvent>{renderImage}</FloatingEvent> : renderImage;


    return (
        <div class={Style.stageObject} onClick={() => trigger()}>
           {renderEvent}
        </div>
    );
}
