
import UIReducer from './reducer/UIReducer';
import GameStatusReducer from './reducer/GameStatusReducer';
import AnimationReducer from './reducer/AnimationReducer';

import { combineReducers } from 'redux';


/**
 * Combine Every Reducer!
 */
let reducer = combineReducers({
    ui: UIReducer,
    game: GameStatusReducer,
    pos: AnimationReducer,
});

export default reducer;

