
export const NULL_TILE = -1;
export const UNMOVEABLETILE = 0;
export const NORMAL_TILE = 1;

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
        backgroundColor: "pink",
    }
}

export const normalTile = {
    key: NORMAL_TILE,
    movable: true,
    style: {
        backgroundColor: "lightblue",
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
        normalTile
    ]
);
export default Tile;





