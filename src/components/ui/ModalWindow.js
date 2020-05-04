
import React from 'react';
import Style from "./../../css/Style.module.css";
import Modal from 'react-modal';

export default function modalWindow(props) {
    return (    
        <Modal 
        isOpen={props.isOpen}
        closeTimeoutMS={500} 
        className={Style.modalWindow}
        overlayClassName={Style.overlay}
        ariaHideApp={false}
        >
            <button onClick={props.unmount}>close</button>
            {props.children}
        </Modal>
    );    
}

