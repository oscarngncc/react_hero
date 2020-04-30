
import UIReducer from './UIReducer';
import GameStatusReducer from './GameStatusReducer';
import { combineReducers } from 'redux';


/**
 * Combine Every Reducer!
 */
let reducer = combineReducers({
    ui: UIReducer,
    gameStatus: GameStatusReducer,
});

export default reducer;

