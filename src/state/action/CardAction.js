

import makeActionCreator from './actionCreator';
import { PLAYER_ID } from '../constant';
import CardData from './../../data/card/Card';

export const DRAW_CARD = "drawCard";
export const DISCARD_CARD = "discardCard";
export const REMOVE_CARD = "removeCard";
export const APPEND_CARD = "addCard"; 
export const SHUFFLE_DECK = "shuffleDeck";
export const DISCARD_HAND = "discardHand";
export const RESET_PILE = "resetPhile";



/**
 * shuffle the deck, performing randomized deck here
 * NOTE: rely on current state
 * NOTE: impure action creator (this is allowed in Redux, just be reminded)
 * @param {boolean} validation to perform validation or not
 */
export function shuffleDeck( validation=true ){
    return (dispatch, getState ) => {
        const deckList = getState().card.deckList;
        const deck = JSON.parse(JSON.stringify(deckList));

        //randomized shuffle
        for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }

        dispatch({
            type: SHUFFLE_DECK,
            cardList: deck,
            validation: validation 
        });
    }
}


/**
 * Perform draw card, shuffle the deck if needed
 * @param {*} num number of card to draw
 */
export function drawCard(num){
    return (dispatch, getState ) => {
        const deckList = getState().card.deckList;
        if (deckList.length < num ){
            let remain = num - deckList.length;
            dispatch( drawCardBasic(deckList.length) );
            dispatch(resetPile());
            dispatch(shuffleDeck());    
            dispatch( drawCardBasic(remain));
        }
        else {
            dispatch(drawCardBasic(num));
        }
    }
}


/**
 * Execute the effect of the card
 * NOTE: Doesn't really consume the card
 * NOTE: This function also works for entities using their moves (as card)
 * @param {*} cardID 
 */
export function runCardEffect( cardID, hostKey = PLAYER_ID ){
    return (dispatch) => {
        const Card = CardData[cardID] ?? {};
        for (var action in Card.effect ){
            dispatch( Card.effect[action](hostKey)  );
        }
    }
}





/**
 * Simple Action Creator
 */
const drawCardBasic = makeActionCreator(DRAW_CARD, "num");
export const discardCard = makeActionCreator( DISCARD_CARD, "pos");
export const removeCard = makeActionCreator(REMOVE_CARD, "cardKey");
export const appendCard = makeActionCreator(APPEND_CARD, "cardKey");

export const discardHand = makeActionCreator(DISCARD_HAND);
export const resetPile = makeActionCreator(RESET_PILE);