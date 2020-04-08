
import React, {Component} from 'react' ;
import Card from './Card';
import Style from './../../css/Style.module.css';

export class HandDraw extends Component {

    state = {
        cardList: [1,2,3,4,5,6,7],
    };
    
   constructor(props){
       super(props);
       this.onClick = this.onClick.bind(this);
       this.renderCardListItem = this.renderCardListItem.bind(this);
       if ( props.cardList !== undefined ){
            this.state.cardList = props.cardList;
       }
    
   }


   onClick(){
        let newList = this.state.cardList;
        newList.pop();
        console.log(newList);

        this.setState({
            cardList : newList 
        });
   }

   renderCardListItem(data, index ) {
        const middle = Math.floor(this.state.cardList.length / 2);
        const rotateDegree = 2;
        const topDistance = 0.45;

        let distance = ( -3 / this.state.cardList.length).toFixed(1).toString();
        let dynamicMargin = "0rem " + distance + "rem";
        let elevation = "";
        let topDist = ""; 

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
            }} 
            onClick = {()=>{}}
            key={index}>
                <Card>{data}</Card>
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

export default HandDraw;