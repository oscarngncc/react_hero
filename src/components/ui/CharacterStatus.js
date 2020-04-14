
import React, {Component} from 'react';
import Style from "./../../css/Style.module.css";

/**
 *  status bar, subscribing to character's state
 */
export default class CharacterStatus extends Component {
    
    render() {
        return (
            <div class={Style.statusBar} >
                <ul>
                    <li class={Style.statusBarItem}>HP: 20/20</li>
                    <li class={Style.statusBarItem}>Money: 130</li>
                    <li class={Style.statusBarItem}>Time: 01:20pm</li>               
                </ul>
            </div>
        )
    }
}
