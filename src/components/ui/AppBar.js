
import React, { Component } from 'react'
import Style from "./../../css/Style.module.css";
// import ModalWindow from "./ModalWindow";

export default class AppBar extends Component {
    
    render() {
        return (
            <ul class={Style.appBar} >
               <li>News</li>
               <li>Status</li> 
               <li>Setting</li>
            </ul>
        )
    }
}
