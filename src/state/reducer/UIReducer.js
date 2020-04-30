
import * as UIAction from './../action/UIAction';


const initState = {
    isNewsOn : false,
    isStatusOn : false,
    isSettingOn : false, 
}


/**
 * AS A REDUCER, YOU CANNOT CHANGE STATE DIRECTLY, YOU NEED TO RETURN A NEW ONE
 * @param {*} state 
 * @param {*} action 
 */
export default function onClickAppBarItemReducer( state = initState, action ){
    switch ( action.type ){
        case UIAction.ON_TOGGLE_NEWS:
            return {
                ...state,
                isNewsOn : ! state.isNewsOn,
            }
        case UIAction.ON_TOGGLE_STATUS:
            return {
                ...state,
                isStatusOn : ! state.isStatusOn,
            }
        case UIAction.ON_TOGGLE_SETTING:
            return {
                ...state,
                isSettingOn : ! state.isSettingOn,
            }
        default:
    }
    return state;
}