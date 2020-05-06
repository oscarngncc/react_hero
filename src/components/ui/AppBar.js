
import React, { useState, Fragment } from 'react'
import {animated, useSprings} from 'react-spring'
import ModalWindow from './ModalWindow';

import Style from "./../../css/Style.module.css";


export default function AppBar(props){
    

    const contents = ["News", "Status", "Setting"];
    const [areItemsOn, setItemsOn] = useState(new Array(contents.length).fill(false));
    const [areItemsHover, setItemsHover] = useState(new Array(contents.length).fill(false));
    
    const springProps = useSprings(areItemsHover.length, areItemsHover.map( item =>
        ({
            opacity: item ?  0.5 : 1,
        })
    ));


    function setItemOn(index, bool){
        let newItemsOn = [...areItemsOn];
        newItemsOn[index] = bool;
        setItemsOn(newItemsOn);
    }

    function setItemHover(index, bool, bug){
        console.log(bug);
        let newItemsHover = [...areItemsHover];
        newItemsHover[index] = bool;
        setItemsHover(newItemsHover);
    }

    return (
        <ul class={Style.appBar}>
            {springProps.map( ( springProp, index) =>(
                <Fragment key={contents[index]}>
                    <animated.li 
                    style={springProp} 
                    onClick={() => setItemOn(index, true)} 
                    onMouseEnter={()=>setItemHover(index, true, springProp)} 
                    onMouseLeave={()=>setItemHover(index, false)} 
                    >
                        {contents[index]}
                    </animated.li>
                    <li>
                        <ModalWindow isOpen={areItemsOn[index]} unmount={ () => setItemOn(index,false)}>
                            <h1>{contents[index]}</h1>
                        </ModalWindow>
                    </li>
                </Fragment>
            ))}
        </ul>
    );
}



/**
*  
//Deprecated: See how much more efficient using Hook for the same thing!
class AppBar extends Component {

    state = {
        onClickNews: undefined,
    }

    constructor(props){
        super(props);
        this.onClickNews = this.onClickNews.bind(this);
        this.onClickSetting = this.onClickSetting.bind(this);
        this.onClickStatus = this.onClickStatus.bind(this);
    }

    onClickNews(){
        this.props.onClickNews();
    }

    onClickSetting(){
        this.props.onClickSetting();
    }

    onClickStatus(){
        this.props.onClickSetting();
    }



    //props for redux-store-state, state for local state
    render() {
        return (
            <ul class={Style.appBar} >
               <li onClick={this.onClickNews} > News </li>
               <li><ModalWindow isOpen={this.props.appBarState.isNewsOn} unmount={this.onClickNews} > 
                    <h1>News</h1> 
                </ModalWindow></li>
               
               <li onClick={this.onClickStatus} >Status</li> 
               <li><ModalWindow isOpen={this.props.appBarState.isStatusOn} unmount={this.onClickStatus} >
                    <h1>Status</h1> 
                </ModalWindow></li>

               <li onClick={this.onClickSetting}>Setting</li>
               <li><ModalWindow isOpen={this.props.appBarState.isSettingOn} unmount={this.onClickSetting} >
                    <h1>Setting</h1> 
                </ModalWindow></li>
            </ul>
        )
    }
}


function mapStateToProps(state){
    return {
        appBarState: state.ui,
    };
}


function mapDispatchToProps(dispatch){
    return {
        //prop function : dispatch action
        onClickNews : () => {
            dispatch( UIAction.onToggleNews() );
        },
        onClickSetting: () => {
            dispatch( UIAction.onToggleSetting() );
        },
        onClickStatus: () => {
            dispatch( UIAction.onToggleStatus() );
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps )(AppBar);
*/