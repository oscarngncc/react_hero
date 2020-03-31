
import React, { Component } from 'react'
import Status from './Status'


export class Monster extends Component {

    state = {
        status: new Status(),
    }

    constructor(props){
        this.state.status = props.status;
        
        if ( ! this.state.status === typeof Status ){ 
            throw new Error("Monster doesn't receive a status");
        }  
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default Monster
