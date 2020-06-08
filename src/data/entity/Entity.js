

export const GHOST = "ghost";
export const MELODY = "melody";


export const ghost = {
    key: GHOST,
    image: "Ghost.png",
    health: 20,
    reward: 10,
    moves: {
        
    },
}


export const melody = {
    key: MELODY,
    image: "Melody.png",
    health: 15,
    reward: 10,
    moves: {

    }
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