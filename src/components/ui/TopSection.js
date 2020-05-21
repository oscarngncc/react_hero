


import React from 'react';
import Style from "./../../css/Style.module.css";

function topSection(props) {
    
    return (
        <div class={Style.topSection} >
            {props.children}
        </div>
    );
}

export default topSection;
