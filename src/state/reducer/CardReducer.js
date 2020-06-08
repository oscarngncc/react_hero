
import * as Action from '../action/action';
import * as Card from './../../data/card/Card';

const CARD_LIMIT = 128;
const HAND_LIMIT = 8;

const defaultList = [
    Card.FORWARD, 
    Card.FORWARD, 
    Card.FORWARD, 
    Card.FORWARD, 
    Card.SPRIAL_OF_LIGHT, 
    Card.STRIKE, 
    Card.SNIPE, 
    Card.TRADE,
];


let initState = {
    handList: [],
    pileList: [],
    deckList: defaultList,
    cardList: defaultList,
}



function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}





/**
 * Draw Card from deckList, perform draw validation (if deck gets empty)
 * @param {*} state 
 * @param {*} action number: no. of card to draw
 */
function drawCard(state, action){
    const number = action.num;
    let newDeckList = JSON.parse(JSON.stringify( state.deckList ));
    let newhandList = JSON.parse(JSON.stringify( state.handList ));
    
    for (let i = 0; i < number; i++){
        if (newhandList >= HAND_LIMIT){
            console.log(`Hand reaching maximum ${HAND_LIMIT}`)
            break;
        }
        let newCard = newDeckList.pop();
        if (newCard === undefined ){
            console.log("the deck has been empty!");
            break;
        }
        else newhandList.push(newCard);
    }

    return updateObject(state, {
        ...state,
        handList: newhandList,
        deckList: newDeckList,
    })
}



/**
 * Discard card from hand in battle, add to pile
 * @param {*} state 
 * @param {*} action action.pos
 */
function discardCard(state, action){
    let newList = state.handList;
    let item = newList.splice(action.pos, 1);

    let newPileList = state.pileList;
    newPileList.push(item);

    return updateObject(state, {
        ...state,
        handList: newList,
        pileList: newPileList,
    });
}



/**
 * Discard all cards from hand in battle, add to pile
 * @param {*} state 
 * @param {*} action 
 */
function discardHand(state){
    const newPileList = state.handList.concat( state.pileList );
    return updateObject(state, {
        ...state,
        handList: [],
        pileList: newPileList,
    });
}




/**
 * Reset the phile list, go back to drawPile
 * @param {*} state 
 * @param {*} action 
 */
function resetPile(state){
    const newDeckList = state.deckList.concat( state.pileList );
    return updateObject(state, {
        ...state,
        pileList: [],
        deckList: newDeckList,
    });
}




/**
 * Shuffle the random deck
 * NOTE: action should be responsible to provide the randomized decklist to ensure purity
 * NOTE: this operation always assume action.cardList is randomized beforehand
 * @param {*} state 
 * @param {*} action action.validation, action.cardList 
 */
function shuffleDeck(state, action){
    const rndDeckList = action.cardList;
    const deckList = state.deckList;
    const checkDeckValid = (action.validation === true || action.validation === false ) ? action.validation: true;

    if (checkDeckValid){
        if (rndDeckList.length !== deckList.length ){
            alert("Shuffle Deck does not have the same length");
            return state;
        }
    }
    return updateObject(state, {
        ...state,
        deckList: rndDeckList,
    });
}





/**
 * Add card to player's card list
 * @param {*} state 
 * @param {*} action 
 */
function addNewCard(state, action){
    const cardKey = action.cardKey;
    let newCardList = state.cardList;

    if ( newCardList >= CARD_LIMIT ){
        alert("Your deck has reached the card limit");
        return state;
    }

    newCardList.push(cardKey);
    return updateObject( state, {
        ...state,
        cardList: newCardList,
    });
}


/**
 * Remove card from player's card list
 * @param {*} state 
 * @param {*} action 
 */
function removeCard(state, action){
    const cardKey = action.cardKey;
    let newCardList = state.cardList;

    const index = newCardList.findIndex( (item) => item === cardKey ); 
    if ( index === -1 ){
        alert(`Your card ${cardKey} doesn't exist inside the cardList!` );
    }

    newCardList.splice(index, 1);
    return updateObject( state, {
        ...state,
        cardList: newCardList
    })
}







export default function CardReducer(state = initState, action){
    switch (action.type){
        case Action.CardAction.DISCARD_CARD:
            return discardCard(state, action);
        case Action.CardAction.DRAW_CARD:
            return drawCard(state, action );
        case Action.CardAction.SHUFFLE_DECK:
            return shuffleDeck(state, action );
        case Action.CardAction.APPEND_CARD:
            return addNewCard(state, action);
        case Action.CardAction.REMOVE_CARD:
            return removeCard(state, action);
        case Action.CardAction.DISCARD_HAND:
            return discardHand(state);
        case Action.CardAction.RESET_PILE:
            return resetPile(state);
        default:
    }
    return state;
}