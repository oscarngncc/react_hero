
import React, {useState, useRef, useEffect} from 'react' ;
import Card from './Card';
import Style from './../../css/Style.module.css';
import {useSpring, useTrail, animated} from 'react-spring';

//import { connect } from 'react-redux';


export default function HandDraw(props){
    const [cardList, setcardList] = useState([1,2,3,4,5,6, 7]);
    const cardRefs = useRef([]);
    const [isProtrait, setisProtrait] = useState(window.innerHeight / window.innerWidth > 1 ? true : false);

    useEffect(() => {
        window.addEventListener("resize", ()=>{  setisProtrait(window.innerHeight / window.innerWidth > 1 ? true : false)    });
        return () => {
            window.removeEventListener("resize", ()=>{} );
        }
    });


    const [initTrail, setInitTrail] = useTrail(cardList.length, function(){
        return {
            from: { 
                transform: "translate(-10rem, 30rem)",
                opacity: 0.6, 
            },
            to: {
                transform: "translate(0, 0)", 
                opacity: 1.0,
            },
            config:  { mass: 2, tension: 600, friction: 55 }
        };
    });


    function idleCardPosition(index){

        if (isProtrait){
            const layer = 2; 
            const cardsPerLayer = 4;  
           
            let distance = ( -4 / cardList.length).toFixed(1).toString();
            let dynamicMargin = "0rem " + distance + "rem";
            let topDist="";

    
            if (index < cardsPerLayer ){
                topDist="15rem";
            }
            else { 
                topDist="3rem";
            }

            return {
                top: topDist,
                margin: dynamicMargin,
            };
        }


        //Helper 
        const middle = Math.floor(cardList.length / 2);
        const rotateDegree = 2;
        const topDistance = 0.85;
        
        let distance = ( -3 / cardList.length).toFixed(1).toString();
        
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


        return {
            margin: dynamicMargin,
            transform: elevation,
            top: topDist,
        };
    }


    function  renderCardListItem(data, index ) {
        return (
            <li 
            class = {Style.cardListItem}
            style = {{...idleCardPosition(index)}} 
            key={index}>
                <animated.div style={initTrail[index]}>
                    <Card clickable={false} hoverable={true} ></Card>
                </animated.div>
            </li>
        );
   }


   return (
    <ul class={Style.handDraw}>
        {cardList.map( 
            (data, index) => renderCardListItem(data, index)  
        )}
    </ul>
    );
    
}



/************** 

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
*/