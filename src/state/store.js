
import { createStore } from 'redux';
import reducer from './reducer/reducer';


/**
 * Singleton,
 * dispatch it to submit and trigger state
 */
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
