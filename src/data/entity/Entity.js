

export const GHOST = 1;
export const MELODY = 2;


export const ghost = {
    key: GHOST,
    image: "",
}


export const melody = {
    key: MELODY,
    image: "",
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