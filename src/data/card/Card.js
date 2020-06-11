import {GameStatusAction} from './../../state/action/action';
import {CardAction} from './../../state/action/action';

export const FORWARD = "Forward";
export const HEAL = "Heal";
export const STRIKE = "Strike";
export const SWIPE = "Swipe";
export const SNIPE = "Snipe";
export const RETREAT = "Retreat";
export const TRADE = "Trade";
export const SPRIAL_OF_LIGHT = "Spiral of Light";
export const RECKLESS_CHARGE = "Reckless Charge";




export const forward = {
    key: FORWARD,
    description: "Gain 1 step",
    particle: "Attack.gif",
    target: [
        {x: 0, y: 0}
    ],
    get effect(){ return [ 
        () => GameStatusAction.incrementStep(1),
    ]},
}


export const strike = {
    key: STRIKE,
    description: "Deal 3# Damage in Range 2",
    particle: "Attack.gif",
    damage: 3,
    target: [
        {x: 1, y: 0}, 
        {x: 2, y: 0}
    ],
    get effect(){ return [ 
        (hostKey) => GameStatusAction.spreadAttack(hostKey, this.target, this.damage ),
    ]},
}



export const spiralOfLight = {
    key: SPRIAL_OF_LIGHT,
    description: "Deal # Damage to All enemies around you",
    particle: "Attack.gif",
    damage: 0,
    target: [
        {x: -1, y: -1}, 
        {x: -1, y: 0}, 
        {x: -1, y: 1}, 
        {x: 0, y: -1},
        {x: 0, y: 1},
        {x: 1, y: -1}, 
        {x: 1, y: 0}, 
        {x: 1, y: 1}, 
    ],
    get effect(){ return [ 
        (hostKey) => GameStatusAction.spreadAttack(hostKey, this.target, this.damage ),
    ]}
}



export const snipe = {
    key: SNIPE,
    description: "Deal # Damage to surrending enemies in next column",
    particle: "Attack.gif",
    damage: 0,
    target: [
        {x: 1, y: 0}, 
        {x: 2, y: 0},
        {x: 3, y: 0}, 
        {x: 4, y: 0}
    ],
    get effect(){ return [ 
        (hostKey) => GameStatusAction.spreadAttack(hostKey, this.target, this.damage ),
    ]},
}


export const swipe = {
    key: SWIPE,
    description: "Deal 2# Damage to all enemies in front of you",
    particle: "Attack.gif",
    damage: 2,
    target: [
        {x: 1, y: 1}, 
        {x: 1, y: 0}, 
        {x: 1, y: -1},
    ],
    get effect(){ return [ 
        (hostKey) => GameStatusAction.spreadAttack(hostKey, this.target, this.damage ),
    ]},
}



export const heal = {
    key: HEAL,
    description: "Recover 5 HP",
    particle: "Attack.gif",
    target: [
        {x: 0, y: 0}
    ],

    get effect(){ return [ 
        () => GameStatusAction.incrementHealth(5),
    ]},
}



export const retreat = {
    key: RETREAT,
    description: "Gain 2 steps. Reduce your attack to 0 this turn",
    particle: "Attack.gif",
    target: [
        {x: 0, y: 0}
    ],
    get effect(){ return [ 
        () => GameStatusAction.incrementStep(2)
    ]},
}



export const trade = {
    key: TRADE,
    description: "Lose 1 step. Draw 3 cards",
    particle: "Attack.gif",
    target: [
        {x: 0, y: 0}
    ],
    get effect(){ return [ 
        () => GameStatusAction.incrementStep(-1),
        () => CardAction.drawCard(3),
    ]},
}





export const recklessCharge = {
    key: RECKLESS_CHARGE,
    description: "Gain 2 steps. You can only move forward (to the right) this turn",
    particle: "Attack.gif",
    target: [
        {x: 0, y: 0}
    ],
    get effect(){ return [ 
        () => GameStatusAction.incrementStep(2),
    ]},
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
    strike,
    snipe,
    swipe,
    retreat,
    trade,
    recklessCharge,
    spiralOfLight,
]);
export default Card;
