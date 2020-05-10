


/**
 * Function for creating action creator
 * @param {*} type datatype, first argument
 * @param  {...any} argNames  argument that will be passed to creator as the header/key
 */
export default function makeActionCreator( actiontype, ...argNames) {
    //Action creator
    return function (...args) {
      const action = { type: actiontype }
      argNames.forEach((arg, index) => {
        action[argNames[index]] = args[index]
      })
      return action;
    }
}