

export const SAVE_ENDPOINT_POS = "saveEndPointPosition";
export const DELETE_ENDPOINT_POS = "deleteEndPointPosition";

/**
 * 
 * @param {String} key - key of the object 
 * @param {float} X - xPos in the browser
 * @param {float} Y - yPos in the bowser
 */
export function saveEndPointPosition( key, X, Y){
    return {
        type: SAVE_ENDPOINT_POS,
        key: key,
        xPos: X,
        yPos: Y,
    };
}

export function deleteEndPointPosition( key){
    return {
        type: DELETE_ENDPOINT_POS,
        key: key,
    };
}