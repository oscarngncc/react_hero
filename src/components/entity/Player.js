

import React, { Component } from 'react'
import Style from "./../../css/Style.module.css";
import Weapon from "./../equipment/Weapon";
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
            <div class={Style.player} >   
                <Weapon isRightHand = "true" isAnimateUp="true" />
                <img alt="Player"></img>
                <Weapon isRightHand = "false" isAnimateUp="false" />  
            </div>
        );
    }
}

export default Player

