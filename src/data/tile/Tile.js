
export const NULL_TILE = -1;
export const UNMOVEABLETILE = 0;
export const NORMAL_TILE = 1;
export const ATTACK_TILE = 2;

export const nullTile = {
    key: NULL_TILE,
    movable: false,
    style: {
        backgroundColor: "grey",
    }
}

export const unMovableTile = {
    key: UNMOVEABLETILE,
    movable: false,
    style: {
        backgroundColor: "whitesmoke",
        border: "solid rgb(230,230,230) 0.5rem"
    }
}

export const normalTile = {
    key: NORMAL_TILE,
    movable: true,
    style: {
        backgroundColor: "rgb(24,24,24)",
    }
}

export const attackTile = {
    key: ATTACK_TILE,
    movable: true,
    style: {
        backgroundColor: "red",
    }
}



function convertObject(arr){
    let result = {};
    for (var i = 0; i < arr.length; i++ ){
        result[arr[i].key] = arr[i];
    }
    return result;
}


const Tile = convertObject(
    [
        nullTile,
        unMovableTile,
        normalTile,
        attackTile,
    ]
);
export default Tile;





