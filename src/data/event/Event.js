
export const EMPTY = 0;
export const PLAYER = 1;

export const empty = {
    key: EMPTY,
    image: "",
}


export const player = {
    key: PLAYER,
    image: "",
}



function convertObject(arr){
    let result = {};
    for (var i = 0; i < arr.length; i++ ){
        result[arr[i].key] = arr[i];
    }
    return result;
}


let Event = convertObject( [empty, player] );
export default Event;