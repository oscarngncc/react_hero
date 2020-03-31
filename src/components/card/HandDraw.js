
import React, {Component} from 'react' ;
import Card from './Card';
import Style from './../../css/Style.module.css';

export class HandDraw extends Component {

    state = {
        cardNum: 5
    };
    
   

    render(){   


        return <ul class={Style.handDraw} >
            <li class = {Style.cardListItem}><Card></Card></li>
            <li class = {Style.cardListItem}><Card></Card></li>
            <li class = {Style.cardListItem}><Card></Card></li>
            <li class = {Style.cardListItem}><Card></Card></li>
            <li class = {Style.cardListItem}><Card></Card></li>
        </ul>;
    }
}

export default HandDraw;