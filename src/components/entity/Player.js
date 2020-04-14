

import React, { Component } from 'react'
import Style from "./../../css/Style.module.css";


export class Player extends Component {

    //Return Character Sprite
    render() {
        return (
            <div class={Style.player} >           
                <img alt="Player"></img> 
            </div>
        );
    }
}

export default Player;

