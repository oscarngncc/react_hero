import { GameStatusAction } from "../../state/action/action";


export const FORWARD = "Forward";
export const HEAL = "Heal";
export const STRIKE = "Strike";
export const RETREAT = "Retreat";
export const RECKLESS_CHARGE = "Reckless Charge";

export const forward = {
    key: FORWARD,
    description: "Gain 1 step",
    effect: [
        GameStatusAction.incrementStep(1),
    ],
}


export const strike = {
    key: STRIKE,
    description: "Deal 3(#) Damage in Range 2",
    effect: [
        
    ]
}


export const heal = {
    key: HEAL,
    description: "Recover 5 HP",
    effect: [
        GameStatusAction.incrementHealth(5),
    ],
}



export const retreat = {
    key: RETREAT,
    description: "Gain 2 steps. Reduce your attack to 0 this turn",
    effect: [
        GameStatusAction.incrementStep(2),
    ]
}



export const recklessCharge = {
    key: RECKLESS_CHARGE,
    description: "Gain 2 steps. You can only move forward (to the right) this turn",
    effect: [
        GameStatusAction.incrementStep(2),
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
    heal,
    retreat,
    recklessCharge,
]);
export default Card;
