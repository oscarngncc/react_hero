import { GameStatusAction } from "../../state/action/action";

export const FORWARD = "forward";
export const HEAL = "heal";

export const forward = {
    key: FORWARD,
    effect: [
        GameStatusAction.incrementStep(1),
    ],
}

export const heal = {
    key: HEAL,
    effect: [
        GameStatusAction.incrementHealth(3),
    ],
}



function convertObject(arr){
    let result = {};
    for (var i = 0; i < arr.length; i++ ){
        result[arr[i].key] = arr[i];
    }
    return result;
}


let Card = convertObject([
    forward,
]);
export default Card;