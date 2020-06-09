
import * as Entity from './../entity/Entity';

export const BASE_1 = "base_1";
export const BASE_2 = "base_2";

export const base_1 = {
    key: BASE_1,
    entities: convertLevelObject([
        { 
            type: Entity.GHOST,
            Coord: {x: 3, y: 2} 
        }
    ]),
}


export const base_2 = {
    key: BASE_2,
    entities: convertLevelObject([
        { 
            type: Entity.GHOST,
            Coord: {x: 3, y: 2} 
        },
        { 
            type: Entity.GHOST,
            Coord: {x: 4, y: 1} 
        },
        { 
            type: Entity.GHOST,
            Coord: {x: 4, y: 3} 
        },
        { 
            type: Entity.GHOST,
            Coord: {x: 4, y: 0} 
        },
    ]),
}



function convertLevelObject(arr){
    let result = {};
    for (var i = 0; i < arr.length; i++ ){
        result[i.toString()] = arr[i];
    }
    return result;
}