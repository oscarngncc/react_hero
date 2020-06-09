
import * as Action from '../action/action';
import * as Event from './../../data/event/Event';


/**
 * InitialState
 * NOTE: all Map are just 2D numeric array
 */
let initState = {
    gameMap : null,
    playerGameMapCoord: { x: 0, y: 0 },
    gameMapRow: -1,
    gameMapCol: -1,

    battleMap : null,
    playerBattleMapCoord: {x: 1, y: 1},
    battleMapRow: -1,
    battleMapCol: -1,

    eventInMap: null,    
    entityInMap: {
        /** example:
            12 : {
                type: ...,
                Coord: { x: 0, y: 0}
            }
        */
    },
}


function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}



/**
 * move the Player in either game or battle map, also perform boundary checking
 * @param {*} state previous state of reducer
 * @param {*} action action
 * @param {*} isGameMap whether it moves in GameMap or BattleMap
 */
function movePlayer(state, action, isGameMap ){

    let xPos = action.Coord.x;
    let yPos = action.Coord.y;


    //move in game map
    if ( isGameMap ){

        //Update Event
        let events = state.eventInMap;
        events[state.playerGameMapCoord.y][state.playerGameMapCoord.x] = Event.EMPTY;
        events[yPos][xPos] = Event.PLAYER;

        if (xPos < 0){xPos = 0}
        else if (xPos > state.gameMapCol - 1 ){ xPos = state.gameMapCol - 1}
        if (yPos < 0){yPos = 0}
        else if (yPos > state.gameMapRow - 1 ){yPos = state.gameMapRow - 1}

        return updateObject(state, {
            ...state,
            playerGameMapCoord: {x: xPos, y: yPos},
            eventInMap: events,
        });
    }
    //move in Battle
    else {
        if (xPos < 0){xPos = 0}
        else if (xPos > state.battleMapCol - 1 ){ xPos = state.battleMapCol - 1}
        if (yPos < 0){yPos = 0}
        else if (yPos > state.battleMapRow - 1 ){yPos = state.battleMapRow - 1}

        return updateObject(state, {
            ...state,
            playerBattleMapCoord: {x: xPos, y: yPos},
        });
    }
}


/**
 * Move entity in map, also perform collision checking
 * @param {*} state 
 * @param {*} action 
 */
function moveEntity(state, action){
    let x = action.Coord.x;
    let y = action.Coord.y;
    const entityKey = action.entityKey;
    const playerBattleMapCoord = state.playerBattleMapCoord;

    
    if (x < 0){x = 0}
    else if (x > state.battleMapCol - 1 ){ x = state.battleMapCol - 1}
    if (y < 0){y = 0}
    else if (y > state.battleMapRow - 1 ){y = state.battleMapRow - 1}


    if (x === playerBattleMapCoord.x && y === playerBattleMapCoord.y ){
        console.log("Collide with Player!");
        return state;
    }

    const entityInMap = state.entityInMap;
    for ( var key in entityInMap ){
        if ( x === entityInMap[key].Coord.x && y === entityInMap[key].Coord.y ){
            console.log("Collide with Entity!");
            return state;
        }
    }

    return updateObject( state, {
        ...state,
        entityInMap: {
            ...entityInMap,
            [entityKey] : {
                Coord: {x: x, y: y},
            }
        }
    }); 
}



function generateGameMap(state, action){
    return updateObject( state, {
        ...state,
        gameMap: action.map,
        gameMapRow: action.row,
        gameMapCol: action.col,
        playerGameMapCoord: action.startCoord,
    });
}


function generateBattleMap(state, action){
    return updateObject( state, {
        ...state,
        battleMap: action.map,
        battleMapRow: action.row,
        battleMapCol: action.col,
        playerBattleMapCoord: {x: 1, y: 1},
    });
}



/**
 * Generate Enemies
 */
function generateEntitiesInStage(state, action){    
    let EntityMap = JSON.parse(JSON.stringify( action.level.entities ));
    return updateObject( state, {
        ...state,
        entityInMap: EntityMap,
    });
}



/**
 * update state in reducer, but also include the player as well
 * @param {*} state previous state
 * @param {*} action action
 */
function generateEvent(state, action){
    let events = action.map;
    events[state.playerGameMapCoord.y][state.playerGameMapCoord.x] = Event.PLAYER;

    return updateObject( state, {
        ...state,
        eventInMap: events,
    });
}


function clearEvent(state, action){
    let events = state.eventInMap;
    events[action.Coord.y][action.Coord.x] = Event.EMPTY;
    return updateObject( state, {
        ...state,
        eventInMap: events,
    });
}




/**
 * Remove entity from map
 * NOTE: this is revoked by the reducer through a GameStatusAction, not a MapAction
 * @param {*} state 
 * @param {*} action 
 */
function removeDefeatedEntityFromMap(state, action){
    let entityKey = action.entityKey;

    //destructure to delete
    const { [entityKey]: value , ...newEntityInMap } = state.entityInMap; 

    return updateObject( state, {
        ...state,
        entityInMap: newEntityInMap,
    });
}



export default function StageReducer(state = initState, action){
    switch (action.type){
        case Action.StageAction.GENERATE_GAMEMAP:
            return generateGameMap(state, action);
        case Action.StageAction.GENERATE_BATTLEMAP:
            return generateBattleMap(state, action);
        case Action.StageAction.GENERATE_LEVEL_BATTLE:
            return generateEntitiesInStage(state, action);
        case Action.StageAction.MOVE_PLAYER_GAMEMAP:
            return movePlayer(state, action, true);
        case Action.StageAction.MOVE_PLAYER_BATTLEMAP:
            return movePlayer(state, action, false);
        case Action.StageAction.GENERATE_EVENT:
            return generateEvent(state, action);
        case Action.GameStatusAction.ENTITY_DEFEAT:
            return removeDefeatedEntityFromMap(state, action);
        case Action.StageAction.CLEAR_EVENT_GAMEMAP:
            return clearEvent(state, action);
        case Action.StageAction.MOVE_ENTITY_BATTLEMAP:
            return moveEntity(state, action);
        default:
    }
    return state;
}
