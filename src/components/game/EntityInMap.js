
import React from 'react';
import { useDispatch } from 'react-redux';

//import Style from './../../css/Style.module.css';
import * as Action from './../../state/action/action';


export default function EntityInMap() {
    let dispatch = useDispatch();

    function triggerBattle(){
        dispatch(Action.StageAction.generateBattleMap());
        dispatch(Action.GameStatusAction.startBattle(true));
    }

    return (
        <div onClick={() => triggerBattle() }>ENEMY</div>
    );
}
