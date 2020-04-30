
//Action
export const INCREMENT_HEALTH = 'incrementHealth';
export const INCREMENT_TIME = 'incrementTime';
export const INCREMENT_MONEY = 'incrementMoney';


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
      return action
    }
}


//Action Creators created by makeActionCreator
export const incrementHealth = makeActionCreator( INCREMENT_HEALTH  , 'value' );
export const incrementTime = makeActionCreator( INCREMENT_TIME, 'value' );
export const incrementMoney = makeActionCreator( INCREMENT_MONEY , 'value');



