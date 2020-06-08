
import makeActionCreator from './actionCreator';
import {CardAction, StageAction} from './action';
import * as Constant from './../constant';


/**
 *  Game Status Related
 */
//Action
export const START_GAME  = 'startGame';
export const START_BATTLE = 'startBattle';
export const RESET_STEP = 'resetStep';
export const INCREMENT_STEPS = 'incrementStep';
export const INCREMENT_HEALTH = 'incrementHealth';
export const INCREMENT_MONEY = 'incrementMoney';
export const INCREMENT_TURN = 'incrementTurn';


export const PLAYER_ATTACK = 'playerAttack';
export const ENTITY_ATTACK = "entityAttack";
export const ENTITY_DEFEAT = 'entityDefeated';



/**
 * Action creator for doing "spread-type" attack
 * NOTE: entitiesCoord is a nested object; targets is an array of Coord object
 * @param {object} playerCoord  player Coord in battleMap
 * @param {object} entitiesCoords entities Coord, should be collected from entityInMap in StageReducer
 * @param {array} targets target by the card
 * @param {number} damage extra damage dealt on top of player's default damage
 * @return  function that fires multiple single attack action 
 */
export function playerSpreadAttack(playerCoord, entitiesCoords, targets, damage=0 ){
    const targetEntity = [];
    
    targets.forEach(function (Coord){
        for (var entityKey in entitiesCoords ){

            const entX = entitiesCoords[entityKey].Coord.x;
            const entY = entitiesCoords[entityKey].Coord.y;

            if ( Coord.x + playerCoord.x === entX && Coord.y + playerCoord.y === entY  ){
                targetEntity.push(entityKey);
            }
        }
    });
    return dispatch => {
        for (const entityKey in targetEntity){
            dispatch( playerAttack(entityKey, damage));
        }
    }
}




/**
 * Iterate the Turn
 * Action including: Draw card, increment turn, reset State
 */
export function iterateTurn(){
    return (dispatch, getState) => {
        
        const deckList = getState().card.deckList;
        const cardList = getState().card.cardList;

        dispatch( CardAction.discardHand());
        if (deckList.length < 4 ){
            //ERROR: shuffle also discard the hand list, need rework
            let remain = 4 - deckList.length;
            dispatch( CardAction.drawCard(deckList.length) );
            dispatch( CardAction.resetPile() );
            dispatch( CardAction.shuffleDeck() );
            dispatch( CardAction.drawCard(remain) );
        }
        else {
            dispatch( CardAction.drawCard(4) );
        }

        dispatch( resetStep() );
        dispatch( incrementTurn(1) );
    }
}






/**
 * Trigger the start of a Battle
 * @param {boolean} value whether it's started or not
 */
export function startBattle(value){
    return (dispatch) => {
        //Operation when a battle starts
        if (value === true ){
            dispatch(StageAction.generateBattleMap());
            dispatch(StageAction.generateLevelInBattle());
            dispatch( iterateTurn() );
        }
        dispatch( {type: START_BATTLE, value: value} );
    }
}


/**
 * Action that triggers the start of battle
 * @param {*} value whether start a game or not
 */
export function startGame(value){
    return (dispatch) => {
        //Operation when the game start
        if (value === true ){
            const mapLength = Constant.DEFAULT_MAP_LENGTH;
            dispatch(StageAction.generateGamePath( mapLength, 20) );
            dispatch(StageAction.generateEvent(mapLength));
        }
        dispatch({type: START_GAME, value: value});
    }
}




//Simple Action based on Action creator
export const resetStep = makeActionCreator(RESET_STEP, 'value');
export const incrementStep = makeActionCreator(INCREMENT_STEPS, 'value');
export const incrementHealth = makeActionCreator( INCREMENT_HEALTH  , 'value' );
export const incrementMoney = makeActionCreator( INCREMENT_MONEY , 'value');
export const incrementTurn = makeActionCreator( INCREMENT_TURN , 'value');

export const playerAttack = makeActionCreator(PLAYER_ATTACK, 'entityKey', 'damage');
export const entityDefeated = makeActionCreator(ENTITY_DEFEAT, 'entityKey');



//Lazy Action based on Action creator
export const healToFullHealth = () => incrementHealth(99999);
export const resetTurn = () => incrementTurn(-99999);
export const lossAllMoney = () => incrementMoney(-99999);
