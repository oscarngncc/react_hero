
/**
 * Function for creating action creator
 * @param {*} type datatype, first argument
 * @param  {...any} argNames  argument that will be passed to creator as the header/key
 */
function makeActionCreator( actiontype, ...argNames) {
    //Action creator
    return function (...args) {
      const action = { type: actiontype }
      argNames.forEach((arg, index) => {
        action[argNames[index]] = args[index]
      })
      return action;
    }
}


/**
 *  Game Status Related
 */
//Action
export const INCREMENT_HEALTH = 'incrementHealth';
export const INCREMENT_TIME = 'incrementTime';
export const INCREMENT_MONEY = 'incrementMoney';
export const incrementHealth = makeActionCreator( INCREMENT_HEALTH  , 'value' );
export const incrementTime = makeActionCreator( INCREMENT_TIME, 'value' );
export const incrementMoney = makeActionCreator( INCREMENT_MONEY , 'value');


/**
 *  Save Position Related
 */
export const SAVE_ENDPOINT_POS = "saveEndPointPosition";
export const saveEndPointPosition = makeActionCreator(SAVE_ENDPOINT_POS, 'key', 'xPos', 'yPos');


/**
 *  UI Related
 */
export const ON_TOGGLE_NEWS = "onToggleNews";
export const ON_TOGGLE_STATUS = "onToggleStatus";
export const ON_TOGGLE_SETTING = "onToggleSetting";
export const onToggleNews = makeActionCreator(ON_TOGGLE_NEWS);
export const onToggleStatus = makeActionCreator(ON_TOGGLE_STATUS);
export const onToggleSetting = makeActionCreator(ON_TOGGLE_SETTING);