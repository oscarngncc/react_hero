
import * as Action from '../action/action';
import * as Card from './../../data/card/Card';

let initState = {
    cardList: [Card.FORWARD, Card.FORWARD, Card.FORWARD, Card.FORWARD],
    deckList:  [Card.FORWARD, Card.FORWARD, Card.FORWARD, Card.FORWARD, Card.FORWARD  ],
}


function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}

export default function CardReducer(state = initState, action){
    switch (action.type){

    }
    return state;
}