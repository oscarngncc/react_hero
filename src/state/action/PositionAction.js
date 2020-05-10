

import makeActionCreator from './actionCreator';

/**
 *  Save Position Related
 */
export const SAVE_ENDPOINT_POS = "saveEndPointPosition";
export const saveEndPointPosition = makeActionCreator(SAVE_ENDPOINT_POS, 'key', 'xPos', 'yPos');