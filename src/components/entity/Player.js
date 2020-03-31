

import React, { Component } from 'react'
import Style from "./../../css/Style.module.css";
import Status from "./Status";

export class Player extends Component {

    //Player Status
    state = {
        status : new Status({HP:0, MaxHP:0, MP: 0, MaxMP: 0, Atk: 0, Def: 0, Magic:0} ),
        armor: "",
        weapon: "",
    }

    constructor(props){
        super(props);
        console.log("Player is created")
    }


    //Return Character Sprite
    render() {
        return (
            <div class={Style.player}>
            </div>
        );
    }
}

export default Player

