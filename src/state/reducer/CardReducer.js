
import * as Action from '../action/action';
import * as Card from './../../data/card/Card';



let initState = {
    handList: [],
    PileList: [],
    deckList: [Card.FORWARD, Card.FORWARD, Card.FORWARD, Card.FORWARD, Card.HEAL, Card.HEAL, Card.HEAL, Card.FORWARD],
    cardList: [Card.FORWARD, Card.FORWARD, Card.FORWARD, Card.FORWARD, Card.HEAL, Card.HEAL, Card.HEAL, Card.FORWARD],
}



function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}


function drawCard(state, action){

    const number = action.num;

    let newDeckList = state.deckList;
    let newhandList = state.handList;

    for (let i = 0; i < number; i++){
        let newCard = newDeckList.pop();
        newhandList.push(newCard);
    }

    return updateObject(state, {
        ...state,
        handList: newhandList,
        deckList: newDeckList,
    })
}


function discardCard(state, action){
    let newList = state.handList;
    newList.splice(action.pos, 1);
    return updateObject(state, {
        ...state,
        handList: newList,
    });
}



export default function CardReducer(state = initState, action){
    switch (action.type){
        case Action.CardAction.DISCARD_CARD:
            return discardCard(state, action);
        case Action.CardAction.DRAW_CARD:
            return drawCard(state, action );
        default:
            
    }
    return state;
}