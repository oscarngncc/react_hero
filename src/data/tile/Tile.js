
export const NULL_TILE = -1;
export const UNMOVEABLETILE = 0;
export const NORMAL_TILE = 1;
export const ATTACK_TILE = 2;

//Default Style
const defaultStyle = {
    border: "solid white 0.3rem",
    boxShadow: "0 12.5px 100px -10px rgba(50, 50, 73, 0.1), 0 10px 10px -10px rgba(50, 50, 73, 0.25)",
}


export const nullTile = {
    key: NULL_TILE,
    movable: false,
    style: {
        ...defaultStyle,
        backgroundColor: "grey",
    }
}

export const unMovableTile = {
    key: UNMOVEABLETILE,
    movable: false,
    style: {
        ...defaultStyle,
        backgroundColor: "whitesmoke",
        border: "solid rgb(230,230,230) 0.5rem"
    }
}

export const normalTile = {
    key: NORMAL_TILE,
    movable: true,
    style: {
        ...defaultStyle,
        backgroundColor: "#1A1A1A",
    }
}

export const attackTile = {
    key: ATTACK_TILE,
    movable: true,
    style: {
        ...defaultStyle,
        backgroundColor: "#F16A70",
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





