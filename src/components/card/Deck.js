
import React, { Component } from 'react';
import Style from './../../css/Style.module.css';
import Card from './Card';

export default class Deck extends Component {
    
    state = {
        cardList: [1,2,3,4,5,6,7,8,9,10,]
    };

    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
        
    }

    onClick(){
        
    }


    renderCard(data, index){
        let topShift  = index * -0.04  + "rem";
        let leftShift = index * -0.04  + "rem";

        return (
            <li class={Style.cardDeckItem} 
            style = {{
                top: topShift,
                left: leftShift,
            }}
            key={index} >
                <Card hoverable={false} clickable={false}>{data}</Card>
            </li>
        );
    }
     

    render() {
        return (
            <ul class = {Style.deck}  >
                {this.state.cardList.map( 
                    (data, index) => this.renderCard(data, index)  
                )}    
            </ul>
        );
    }
}
