

import React from 'react';
import Style from "./../../css/Style.module.css";

/**
 * Component used by entity and player in map to talk something
 */
export default function DialogBox() {
    return (
        <div class={`${Style.dialogBox}` } >
            Talk Something
        </div>
    )
}
