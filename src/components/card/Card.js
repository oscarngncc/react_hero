
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
        hoverable: true,
        clickable: true,
    }

    wrapperRef;

    constructor(props){
        super(props);
        this.state.name = props.name;
        this.wrapperRef = React.createRef();
        this.onClick = this.onClick.bind(this);

        if (props.isFaceDown !== undefined ){
            this.state.isFaceDown = props.isFaceDown;
        }
        if (props.hoverable !== undefined ){
            this.state.hoverable = props.hoverable;
        }
        if (props.clickable !== undefined ){
            this.state.clickable = props.clickable;
        }
    }

    onClick(){
        if ( this.state.clickable ){
            const wrapper = this.wrapperRef.current;
            wrapper.classList.toggle(Style.isFlipped);
        }
    }


    render(){
        var hoverableCard = (this.state.hoverable) ? Style.hoverableCard : "";
        return (
        <div class={Style.card} onClick={()=>this.onClick()} >
            <div class={Style.cardInner} ref = {this.wrapperRef}  >
                <div class={[ Style.frontCard, hoverableCard ].join(' ')}>
                    {this.state.content}
                </div>
                <div class={[ Style.rearCard, hoverableCard ].join(' ')}>
                    rearCard
                </div>
            </div>
        </div>
        );       
    }
}


export default Card;