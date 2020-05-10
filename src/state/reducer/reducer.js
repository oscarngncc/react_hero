

import GameStatusReducer from './GameStatusReducer';
import PositionReducer from './PositionReducer';


import { combineReducers } from 'redux';


/**
 * Combine Every Reducer!
 */
let reducer = combineReducers({
    game: GameStatusReducer,
    pos: PositionReducer,
});

export default reducer;

