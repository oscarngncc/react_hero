
import React, { Component } from 'react';
import Modal from 'react-modal';
import Style from "./../../css/Style.module.css";


export default class ModalWindow extends Component {
    render() {
        return (    
            <Modal 
            isOpen={this.props.isOpen}
            className={Style.modalWindow}
            overlayClassName={Style.overlay}
            >
                <button onClick={this.props.unmount}>close</button>
                {this.props.children}
            </Modal>
        )
    }
}

