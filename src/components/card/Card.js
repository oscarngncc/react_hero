
import React, {Component} from 'react' ;
import Style from './../../css/Style.module.css';

export class Card extends Component {

    state = {
        name:"Card",
    }

    constructor(props){
        super(props);
        this.state.name = props.name;
    }

    render(){
        return <div class={Style.card}>
            Card
        </div>;
        
    }
}


export default Card;