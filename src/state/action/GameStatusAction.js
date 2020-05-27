
import makeActionCreator from './actionCreator';


/**
 *  Game Status Related
 */
//Action
export const START_GAME  = 'startGame';
export const START_BATTLE = 'startBattle';

export const INCREMENT_STEPS = 'incrementStep';
export const INCREMENT_HEALTH = 'incrementHealth';
export const INCREMENT_MONEY = 'incrementMoney';


export const startGame =  makeActionCreator(START_GAME, 'value');
export const startBattle = makeActionCreator(START_BATTLE, 'value');

export const incrementStep = makeActionCreator(INCREMENT_STEPS, 'value');
export const incrementHealth = makeActionCreator( INCREMENT_HEALTH  , 'value' );
export const incrementMoney = makeActionCreator( INCREMENT_MONEY , 'value');