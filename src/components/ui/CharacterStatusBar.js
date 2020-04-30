
import React, {Component} from 'react';
import Style from "./../../css/Style.module.css";

//All you need to connect component to redux
import { connect } from 'react-redux';



/**
 *  status bar, subscribing to character's state
 */
class CharacterStatusBar extends Component {
    
    render() {
        let HP = Math.round(this.props.gameStatus.health)
        let MaxHP = Math.round(this.props.gameStatus.healthLimit)
        let Money = Math.round(this.props.gameStatus.money)
        let Hour = Math.round(this.props.gameStatus.time).toString() + ": 00"

        return (
            <div class={Style.statusBar} >
                <ul>
                    <li class={Style.statusBarItem}>HP: {HP}/{MaxHP}</li>
                    <li class={Style.statusBarItem}>Money: {Money}</li>
                    <li class={Style.statusBarItem}>Time: {Hour}</li>              
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        gameStatus: state.gameStatus,
    };
}

export default connect(mapStateToProps)(CharacterStatusBar);