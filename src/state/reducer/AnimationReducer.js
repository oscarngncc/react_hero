
import * as AnimationAction from "./../action";

let initState = {
    positions : undefined
};


function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}


function savePositions(state, action){
    let newPositions = (state.positions !== undefined) ? state.positions: {};

    newPositions[ action.key ] = {
        xPos: action.xPos,
        yPos: action.yPos,
    }

    return  updateObject( state, {
        ...state,
        positions: newPositions,
    });
}



export default function animationReducer(state=initState, action){
    switch (action.type){
        case AnimationAction.SAVE_ENDPOINT_POS:
            return savePositions(state, action);
        default:
            
    }
    return state;
}
