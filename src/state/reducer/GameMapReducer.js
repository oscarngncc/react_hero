
import * as Action from '../action/action';

let initState = {
    battleMap = null,
    gameMap = null,
    row: -1,
    col: -1,
    playerXPos: -1,
    playeryPos = -1,
}


function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}



export default function gameMapReducer(state = initState, action){
    switch (action.type){
        case Action.GameMapAction.GENERATE_GAMEMAP:
            return updateObject( state, {
                ...state,
                gameMap: action.gameMap,
                row: action.row,
                col: action.col,
            });
        default:
    }
    return state;
}
