
import { combineReducers } from 'redux';

import GameStatusReducer from './GameStatusReducer';
//import PositionReducer from './PositionReducer';
import StageReducer from './StageReducer';
import CardReducer from './CardReducer';




/**
 * Combine Every Reducer!
 */
let reducer = combineReducers({
    game: GameStatusReducer,
    map: StageReducer,
    card: CardReducer,
    //pos: PositionReducer,
});

export default reducer;

