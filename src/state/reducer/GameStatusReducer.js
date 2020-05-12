
import * as Action from '../action/action';

/**
 *  time: within range (0,24)
 */
let initState = {
    startGame: false,
    isBattle: false,

    health: 20,
    healthLimit: 20,
    money: 0,
    time: 6,
    day: 1,
}



function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}



function startGame(state, action){
    return updateObject( state, {
        ...state,
        startGame: action.value,
    });
}


function startBattle(state, action){
    return updateObject( state, {
        ...state,
        isBattle: action.value,
    });
}



function incrementHealth(state, action){
    let newHP = Math.max(0, state.health + action.value );
    return updateObject( state, {
        ...state,
        health: newHP,
    });
}



function incrementMoney(state, action){
    let newMoney = Math.max(0, state.money + action.value);
    return updateObject( state, {
        ...state,
        money: newMoney,
    });
}


function incrementTime(state, action){
    let timeChange = Math.abs(action.value);
    let newDay = state.Day + Math.floor(timeChange/24);
    let newTime = Math.max(0, state.time + timeChange ) % 24 ;
    return updateObject( state, {
        ...state,
        day: newDay,
        time: newTime,
    });
}


export default function gameStatusReducer( state = initState, action ){
    switch ( action.type ){
        case Action.GameStatusAction.START_GAME:
            return startGame(state, action);
        case Action.GameStatusAction.START_BATTLE:
            return startBattle(state, action);
        case Action.GameStatusAction.INCREMENT_HEALTH:
            return incrementHealth(state, action);
        case Action.GameStatusAction.INCREMENT_MONEY:
            return incrementMoney(state, action);
        case Action.GameStatusAction.INCREMENT_TIME:
            return incrementTime(state, action);     
        default:
            return state;  
    }
}