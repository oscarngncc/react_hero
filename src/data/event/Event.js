
export const EMPTY = 0;
export const PLAYER = 1;
export const ENEMY = 2;

export const empty = {
    key: EMPTY,
    image: "",
}


export const player = {
    key: PLAYER,
    image: "Player.png",
}

export const enemy = {
    key: ENEMY,
    image: "",
}



function convertObject(arr){
    let result = {};
    for (var i = 0; i < arr.length; i++ ){
        result[arr[i].key] = arr[i];
    }
    return result;
}


let Event = convertObject( [
    empty, 
    player, 
    enemy,
]);
export default Event;