
import * as Action from '../action/action';
import * as Entity from '../../data/entity/Entity';

/**
 *  time: within range (0,24)
 */
let initState = {
    startGame: false,
    isBattle: false,

    health: 20,
    healthLimit: 20,
    steps: 2,
    stepsLimit: 2,

    money: 0,

    entitiesStatus: {
    },
}


function updateObject(old, newObj){
    return Object.assign({}, old, newObj );
}


function startGame(state, action){
    return updateObject( state, {
        ...state,
        startGame: action.value,
    });
}


function startBattle(state, action){
    return updateObject( state, {
        ...state,
        isBattle: action.value,
    });
}


/**
 * Generate Entities based on level, including setting up statuses
 * @param {*} state 
 * @param {*} action 
 */
function generateEntitiesInBattle(state, action){
    let newEntities = JSON.parse(JSON.stringify( action.level.entities ));
    
    for (let key in newEntities ){
        delete newEntities[key].Coord;

        //SetUp
        let entity = Entity.default[ newEntities[key].type.toString() ];
        newEntities[key].health = entity.health;
        newEntities[key].healthLimit = entity.health;
        newEntities[key].reward = entity.reward;
    }
    
    
    return updateObject( state, {
        ...state,
        entitiesStatus: newEntities, 
    });
}


function incrementSteps(state, action){
    let newSteps = Math.max(0, state.steps + action.value );
    return updateObject( state, {
        ...state,
        steps: newSteps,
    });
}



function incrementHealth(state, action){
    let newHP = Math.max(0, state.health + action.value );
        newHP = Math.min(newHP, state.healthLimit );

    return updateObject( state, {
        ...state,
        health: newHP,
    });
}


function incrementHealthLimit(state, action){
    let HPLimit = Math.max(0, state.healthLimit + action.value );
    return updateObject( state, {
        ...state,
        healthLimit: HPLimit,
    });
}



function incrementMoney(state, action){
    let newMoney = Math.max(0, state.money + action.value);
    return updateObject( state, {
        ...state,
        money: newMoney,
    });
}




export default function gameStatusReducer( state = initState, action ){
    switch ( action.type ){
        case Action.GameStatusAction.START_GAME:
            return startGame(state, action);
        case Action.GameStatusAction.START_BATTLE:
            return startBattle(state, action);
        case Action.StageAction.GENERATE_LEVEL_BATTLE:
            return generateEntitiesInBattle(state, action);
        case Action.GameStatusAction.INCREMENT_STEPS:
            return incrementSteps(state, action);
        case Action.GameStatusAction.INCREMENT_HEALTH:
            return incrementHealth(state, action);        
        case Action.GameStatusAction.INCREMENT_MONEY:
            return incrementMoney(state, action);  
        default:
            return state;  
    }
}