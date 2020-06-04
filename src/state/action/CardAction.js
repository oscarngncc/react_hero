

import makeActionCreator from './actionCreator';


export const DRAW_CARD = "drawCard";
export const DISCARD_CARD = "discardCard";

export const REMOVE_CARD = "removeCard";
export const APPEND_CARD = "addCard"; 

export const SHUFFLE_DECK = "shuffleDeck";



/**
 * shuffle the deck
 * NOTE: since reducer supposed to be pure, a deck must be provided to action, the reducer only do validation
 * @param {*} deck 1D numeric array that contains card
 */
export function shuffleDeck(deck){
    return {
        type: SHUFFLE_DECK,
        deck: deck,
    }
}

export const drawCard = makeActionCreator(DRAW_CARD, "num");
export const discardCard = makeActionCreator( DISCARD_CARD, "pos");

export const removeCard = makeActionCreator(REMOVE_CARD);
export const appendCard = makeActionCreator(APPEND_CARD);