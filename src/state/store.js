
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer/reducer';
import thunk from 'redux-thunk';

/**
 * Singleton,
 * dispatch it to submit and trigger state
 */
const store = createStore(
    reducer,
    applyMiddleware(thunk)
);
export default store;
