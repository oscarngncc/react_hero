
import React from 'react';
import Style from './../../css/Style.module.css';


export default function Stage(props){
    return (
        <div class={Style.stage} >
            {props.children}
        </div>
    );
    
}


