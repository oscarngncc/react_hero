
import { createStore } from 'redux';
import reducer from './reducer';


/**
 * Singleton,
 * dispatch it to submit and trigger state
 */
const store = createStore(reducer);
export default store;
