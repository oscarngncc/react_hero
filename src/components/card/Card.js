
import React, {Component} from 'react' ;
import Style from './../../css/Style.module.css';

/** 
 *  Card Component, including front side and rear side 
*/
export class Card extends Component {

    state = {
        name:"Card",
        content: "frontCard",
        isFaceDown: false,
    }

    wrapperRef;

    constructor(props){
        super(props);
        this.state.name = props.name;
        this.state.isFaceDown = props.isFaceDown;
        this.wrapperRef = React.createRef();
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        const wrapper = this.wrapperRef.current;
        wrapper.classList.toggle(Style.isFlipped);
    }


    render(){
        return (
        <div class={Style.card} onClick={()=>this.onClick()} >
            <div class={Style.cardInner} ref = {this.wrapperRef}  >
                <div class={[ Style.frontCard, Style.hoverableCard].join(' ')}>
                    {this.state.content}
                </div>
                <div class={[ Style.rearCard, Style.hoverableCard].join(' ')}>
                    rearCard
                </div>
            </div>
        </div>
        );       
    }
}


export default Card;