
import React, { Component } from 'react';
import Status from './Status';
import Style from './../../css/Style.module.css';


export class Monster extends Component {

    state = {
        status: new Status(),
    }

    constructor(props){
        super(props);
        this.state.status = props.status;

        if ( ! this.state.status === typeof Status ){ 
            throw new Error("Monster doesn't receive a status");
        }  
    }

    render() {
        return (
            <div class={Style.monster} >
            </div>
        )
    }
}

export default Monster
