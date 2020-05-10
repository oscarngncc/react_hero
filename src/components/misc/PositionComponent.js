

import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Action from './../../state/action/action';
import Style from './../../css/Style.module.css';


class PositionComponent extends Component {

    static propTypes = {
        positionKey: PropTypes.string.isRequired
    }

    constructor(props){
        super(props);
        this.savePosition = this.savePosition.bind(this);
        this.selector = React.createRef();

        this.state = {
            key: props.positionKey
        }
    }

    
    savePosition(){
        let domRect = this.selector.current.getBoundingClientRect();
        let xPos = domRect['x'] + domRect['width'] / 2;
        let yPos = domRect['y'] + domRect['height'] / 2; 
        this.props.savePosition( this.state.key , xPos, yPos); 
    }


    componentDidMount(){
        window.addEventListener("resize", this.savePosition);
        this.savePosition();
    }


    componentWillUnmount(){
        window.removeEventListener("resize", this.savePosition);
    }

    
    render() {
        return (
            <div class={Style.posComponent} ref={this.selector}>{this.props.children}</div>
        )
    }
}



function mapDispatchToProps(dispatch){
    return {
        savePosition: (key, xPos, yPos) => {
            dispatch(Action.PositionAction.saveEndPointPosition(key, xPos, yPos) )
        },
    }
}

export default connect(null, mapDispatchToProps)(PositionComponent);