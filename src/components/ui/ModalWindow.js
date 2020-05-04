
import React, { Component } from 'react';
import Modal from 'react-modal';
import Style from "./../../css/Style.module.css";
//import "./../../css/Special.css";


export default class ModalWindow extends Component {
    render() {
        return (    
            <Modal 
            isOpen={this.props.isOpen}
            closeTimeoutMS={500} 
            className={Style.modalWindow}
            overlayClassName={Style.overlay}
            ariaHideApp={false}
            >
                <button onClick={this.props.unmount}>close</button>
                {this.props.children}
            </Modal>
        )
    }
}

