
import React from 'react';
import { useDispatch } from 'react-redux';

//import Style from './../../css/Style.module.css';
import * as Action from './../../state/action/action';


export default function EntityInMap(props){
    let dispatch = useDispatch();

    function triggerBattle(){
        dispatch(Action.StageAction.generateBattleMap());
        dispatch(Action.StageAction.generateLevelInBattle());
        dispatch(Action.GameStatusAction.startBattle(true));
    }

    return (
        <div onClick={() => triggerBattle()}  >ENEMY</div>
    );
}
