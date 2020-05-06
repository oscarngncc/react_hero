
import React, {Component} from 'react' ;
import Card from './Card';
import Style from './../../css/Style.module.css';
import { connect } from 'react-redux';

class HandDraw extends Component {


   static defaultProps = {
       cardList: [1,2,3,4,5,6,7,8],
   };

   
   constructor(props){
       super(props);
       this.clickCard = this.clickCard.bind(this);
       this.renderCardListItem = this.renderCardListItem.bind(this);
       this.Dismiss = this.Dismiss.bind(this);
       this.animateToStage = this.animateToStage.bind(this);
       this.cardRefs = [];


       this.state = {
           cardList: props.cardList,
           styles: {},
       }
   }

   

   /**
    * Effect after clicking the card
    * @param {*} index 
    */
   clickCard(index){
        //this.animateToStage(index);    
        this.Dismiss(index);  
   }


   Dismiss(index){         
        this.setState(prevState => {
            let newCardList = prevState.cardList;
            newCardList.splice(index, 1);
            return {
                cardList: newCardList
            }
        });
   }



   /**
    * Moving Card from X to stage
    * @param {*} index 
    */
   animateToStage(index){
        let endCoord = this.props.animationStatus.positions["Stage"];

        let domRect = this.cardRefs[index].current.getBoundingClientRect();
        let xPos = domRect['x'] + domRect['width'] / 2;
        let yPos = domRect['y'] + domRect['height'] / 2; 
        
        let xDis =  endCoord["xPos"] - xPos;
        let yDis =  endCoord["yPos"] - yPos;

        //Animation: Option 1
        //this.cardRefs[index].current.style.left = xDis.toString() + "px";
        //this.cardRefs[index].current.style.top = yDis.toString() + "px";

        //Animation: Option 2
        this.setState(prevState => ({
            styles: {
                ...prevState.styles,
                [index]: {
                    ...prevState.styles[index],
                    top: yDis.toString() + "px",
                    left: xDis.toString() + "px",
                }
            }
        }));     
   }


   
   /**
    * Function for rendering each individual card item, also setting things up, including refs
    * @param {*} data 
    * @param {*} index - index of the card
    */
   renderCardListItem(data, index ) {

        // curve equation: y = -0.005x^2
        const middle = Math.floor(this.state.cardList.length / 2);
        const rotateDegree = 2;
        const topDistance = 0.85;

        let distance = ( -3 / this.state.cardList.length).toFixed(1).toString();
        
        let dynamicMargin = "0rem " + distance + "rem";
        let elevation = "";
        let topDist = "";
        

        //ref
        let cardListItemRef = React.createRef();
        this.cardRefs[index] = cardListItemRef;

        if ( index === middle ){
            elevation = "rotate("+ rotateDegree/2 +"deg)"
            topDist =  (topDistance / 2) + "rem";
        }
        else { 
            elevation = "rotate(" + (-(middle-index) * rotateDegree).toString() + "deg)";
            topDist = ( topDistance * Math.abs((middle-index))).toString()  + "rem";
        }

        return (
            <li 
            class = {Style.cardListItem}
            style = {{
                margin: dynamicMargin,
                transform: elevation,
                top: topDist,
                ...this.state.styles[index],
            }} 
            onClick = { () => this.clickCard(index) }
            ref={this.cardRefs[index] }
            key={index}>
                <Card clickable={false} hoverable={true} ></Card>
            </li>
        );
   }
   

    render(){     
        return (
            <ul class={Style.handDraw}>
                {this.state.cardList.map( 
                    (data, index) => this.renderCardListItem(data, index)  
                )}
            </ul>
        );
    }
}


function mapStateToProps(state){
    return {
        animationStatus: state.animation,
    };
}

export default connect(mapStateToProps)(HandDraw);