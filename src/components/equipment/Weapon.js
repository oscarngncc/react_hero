

import React, { Component } from 'react';
import Style from "./../../css/Style.module.css";


export class Weapon extends Component {
    
    timerID;
    state = {
        isRightHand: true,
        isAnimateUp: false,
    };

    constructor(props){
        super(props);
        this.state.isRightHand = props.isRightHand;
        this.state.isAnimateUp = props.isAnimateUp;
        this.state.delayAnimation = props.delay;
    }

    componentDidMount(){
        this.timerID = setInterval( ()=> {
            this.setState( function (state, props) {
                return {isAnimateUp : ! this.state.isAnimateUp  } 
            });
        }, 1000 );
    }


    componentWillMount(){
        clearInterval(this.timerID);
    }

    
    render() {
        let animateStyle = (this.state.isAnimateUp) ? {top: '0rem'} : {top: '0.5rem'};
        return (
            <div class={Style.weapon} style = {animateStyle} > 
                Hello EveryOne               
            </div>
        )
    }
}

export default Weapon