import * as Card from './../card/Card';
import {StageAction } from './../../state/action/action';
import { MOVE_STYLE } from '../../state/constant';

export const GHOST = "ghost";
export const MELODY = "melody";


export const ghost = {
    key: GHOST,
    image: "Ghost.png",
    distance: 3,
    health: 20,
    reward: 10,
    attack: 20,
    style: MOVE_STYLE.defense,
    get cards(){ return [ 
        Card.SPRIAL_OF_LIGHT,
    ]},
}

export const melody = {
    key: MELODY,
    image: "Melody.png",
    health: 15,
    reward: 10,
    style: MOVE_STYLE.offense,
    get cards(){ return [ 
        
    ]},
}


function convertObject(arr){
    let result = {};
    for (var i = 0; i < arr.length; i++ ){
        result[arr[i].key] = arr[i];
    }
    return result;
}


let Entity = convertObject([
    ghost,
    melody,
]);



export default Entity;