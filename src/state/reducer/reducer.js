

import GameStatusReducer from './GameStatusReducer';
import PositionReducer from './PositionReducer';
import StageReducer from './StageReducer';


import { combineReducers } from 'redux';


/**
 * Combine Every Reducer!
 */
let reducer = combineReducers({
    game: GameStatusReducer,
    map: StageReducer,
    pos: PositionReducer,
});

export default reducer;

