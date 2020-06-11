
import makeActionCreator from './actionCreator';
import {CardAction, StageAction} from './action';
import * as Constant from './../constant';


/**
 *  Game Status Related
 */
//Action
export const START_GAME  = 'startGame';
export const START_BATTLE = 'startBattle';
export const SET_INPUT_LOCK = 'setInputLock';
export const SET_PLAYER_DIRECTION = 'setPlayerDirection';
export const SET_ENTITY_DIRECTION = 'setEntityDirection';

export const RESET_STEP = 'resetStep';
export const INCREMENT_STEPS = 'incrementStep';
export const INCREMENT_HEALTH = 'incrementHealth';
export const INCREMENT_MONEY = 'incrementMoney';
export const INCREMENT_TURN = 'incrementTurn';


export const ATTACK = 'Attack';
export const ENTITY_DEFEAT = 'entityDefeated';



/**
 * Action creator for doing "spread-type" attack
 * NOTE: entitiesCoord is a nested object; targets is an array of Coord object
 */
export function spreadAttack( hostKey, ranges, damage=0  ){  

    return (dispatch, getState) => {
        const allCoords = { ...getState().map.entityInMap, [Constant.PLAYER_ID]: { Coord: getState().map.playerBattleMapCoord}  } 
        const direction = getState().game.statuses[hostKey].direction;
        const dirMultiplier = (direction === Constant.DIRECTION.left ) ? -1 : 1;

        let affected = [];

        ranges.forEach( function(Coord){
            for (var targetKey in allCoords ){
                const entX = allCoords[targetKey].Coord.x;
                const entY = allCoords[targetKey].Coord.y;
                if ( Coord.x * dirMultiplier  + allCoords[hostKey].Coord.x  === entX && Coord.y + allCoords[hostKey].Coord.y === entY  ){
                    affected.push(targetKey);
                }
            }
        });

        affected.forEach( function (targetKey) {
            dispatch( attack(hostKey, targetKey, damage ) );
        });
    }
}




/**
 * Iterate the Turn
 * Action including: Draw card, increment turn, reset State
 */
export function iterateTurn(){
    return (dispatch, getState) => {
        dispatch( incrementTurn(1) );

        const deckList = getState().card.deckList;

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
export const setInputLock = makeActionCreator(SET_INPUT_LOCK, 'value');
export const resetStep = makeActionCreator(RESET_STEP, 'value');
export const incrementStep = makeActionCreator(INCREMENT_STEPS, 'value');
export const incrementHealth = makeActionCreator( INCREMENT_HEALTH  , 'value' );
export const incrementMoney = makeActionCreator( INCREMENT_MONEY , 'value');
export const incrementTurn = makeActionCreator( INCREMENT_TURN , 'value');
export const entityDefeated = makeActionCreator(ENTITY_DEFEAT, 'entityKey');
export const togglePlayerDirection = makeActionCreator(SET_PLAYER_DIRECTION);
export const setEntityDirection = makeActionCreator(SET_ENTITY_DIRECTION, 'entityKey', 'direction');
export const attack = makeActionCreator(ATTACK, 'hostKey', 'targetKey', 'damage')



//Lazy Action based on Action creator
export const healToFullHealth = () => incrementHealth(99999);
export const resetTurn = () => incrementTurn(-99999);
export const lossAllMoney = () => incrementMoney(-99999);
export const playerAttack = (entityKey, damage) => attack( Constant.PLAYER_ID , entityKey, damage );