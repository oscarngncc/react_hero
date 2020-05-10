
import makeActionCreator from './actionCreator';


/**
 *  Game Status Related
 */
//Action
export const INCREMENT_HEALTH = 'incrementHealth';
export const INCREMENT_TIME = 'incrementTime';
export const INCREMENT_MONEY = 'incrementMoney';
export const incrementHealth = makeActionCreator( INCREMENT_HEALTH  , 'value' );
export const incrementTime = makeActionCreator( INCREMENT_TIME, 'value' );
export const incrementMoney = makeActionCreator( INCREMENT_MONEY , 'value');