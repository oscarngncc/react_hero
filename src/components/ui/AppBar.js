
import React from 'react'
import Style from "./../../css/Style.module.css";

import { useDispatch, useSelector } from 'react-redux';
import * as UIAction from '../../state/action';

import ModalWindow from './ModalWindow';


export default function AppBar(props){
    
    const dispatch = useDispatch();
    const isNewsOn = useSelector(state => state.ui.isNewsOn);
    const isStatusOn = useSelector(state => state.ui.isStatusOn);
    const isSettingOn = useSelector(state => state.ui.isSettingOn);

    

    function onClickNews(){
        dispatch(UIAction.onToggleNews());
    }

    function onClickSetting(){
        dispatch(UIAction.onToggleSetting());
    }

    function onClickStatus(){
        dispatch(UIAction.onToggleStatus());
    }

    return (
        <ul class={Style.appBar} >
           <li onClick={ () => onClickNews()} > News </li>
           <li><ModalWindow isOpen={isNewsOn} unmount={ () => onClickNews()} > 
                <h1>News</h1> 
            </ModalWindow></li>
           
           <li onClick={() => onClickStatus()} >Status</li> 
           <li><ModalWindow isOpen={isStatusOn} unmount={() => onClickStatus()} >
                <h1>Status</h1> 
            </ModalWindow></li>

           <li onClick={() => onClickSetting()}>Setting</li>
           <li><ModalWindow isOpen={isSettingOn} unmount={() => onClickSetting()} >
                <h1>Setting</h1> 
            </ModalWindow></li>
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