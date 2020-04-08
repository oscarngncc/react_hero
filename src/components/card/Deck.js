
import React, { Component } from 'react'

export default class Deck extends Component {
    
    state = {
        cardNum: 40
    };

    constructor(props){
        super(props);
        this.state.blue = props.blue;
    }
    
    render() {
        return (
            <div>
                
            </div>
        );
    }
}
