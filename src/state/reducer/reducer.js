
import UIReducer from './UIReducer';
import GameStatusReducer from './GameStatusReducer';
import AnimationReducer from './AnimationReducer';

import { combineReducers } from 'redux';


/**
 * Combine Every Reducer!
 */
let reducer = combineReducers({
    ui: UIReducer,
    gameStatus: GameStatusReducer,
    animation: AnimationReducer,
});

export default reducer;

