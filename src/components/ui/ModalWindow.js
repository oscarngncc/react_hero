
import React, { Component } from 'react';
import Modal from 'react-modal';
import Style from "./../../css/Style.module.css";

export default class ModalWindow extends Component {

    state = {
        isOpen: false,
    }

    constructor(props){
        super(props);
        if (props.isOpen !== undefined )
            this.state.isOpen = props.isOpen;
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(){
        this.setState({
            isOpen : true
        });
    }

    closeModal(){
        this.setState({
            isOpen : false
        });
    }


    render() {
        return (
            <Modal 
            style = {Style.modalWindow}
            isOpen={this.state.isOpen}
            onRequestClose={this.state.closeModal()} 
            >
                <h1>Hello World!</h1>
            </Modal>
        )
    }
}
