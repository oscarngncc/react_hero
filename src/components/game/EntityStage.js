
import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import Style from './../../css/Style.module.css';

export default function EntityStage(){
    const [gameMap, setgameMap] = useState(
        [
            [0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0,],
        ]
    );
    const renderMap = [].concat.apply([], gameMap);
    const posObj = useSelector(state => state.pos.positions );



    function renderEntity(index){
        if (posObj === undefined){return; }
        let Pos = posObj["tile" + index.toString()];
        console.log(Pos);
        let style = {
            top: (-Pos.yPos).toString() + "px",
            left: Pos.xPos.toString() + "px",
        }
        return (
            <li key = {"entityTile" + index.toString()} class={Style.entityTile} style ={style} >
                <p>HELLO</p>
            </li>
        );
    }

    return (
    <ul class={Style.entityMap}>
        {renderMap.map((data, index) => {
            return (
                renderEntity(index)
            );
        })}
    </ul>
    );
}

//let columnLen = (gameMap.length != 0 ) ? gameMap[0].length : -1;
//if (columnLen === -1 ){ return; }
//let row = Math.floor(index/columnLen);
//let col = Math.floor(index%columnLen);