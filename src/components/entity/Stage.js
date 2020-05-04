
import React, { Component } from 'react';
import Style from './../../css/Style.module.css';


export default class Stage extends Component {
    render() {
        return (
            <div class={Style.stage} ref={this.selector} >
            </div>
        )
    }
}


