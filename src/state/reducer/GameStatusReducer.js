
import * as Action from '../action/action';
import * as Entity from '../../data/entity/Entity';
import * as Constant from './../constant';
import {PLAYER_ID} from './../constant';
import Update from 'immutability-helper';


let initState = {
    //Game-Related, singleton status
    startGame: false,
    isBattle: false,
    inputLock: false,
    
    turn: 0,
    money: 0,

    //Player exclusive stat:
    steps: 10, 
    stepsLimit: 10,

    entities: [],

    statuses: {
        [Constant.PLAYER_ID]: {
            health: 20,
            healthLimit: 20,
            attack: 10, //3
            attackTemp: 0,
            direction: Constant.DIRECTION.right
        },
        /** other possible entities statuses */
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



function setInputLock(state, action){
    return updateObject(state, {
        ...state,
        inputLock: action.value,
    })
}



function resetStep(state){
    return updateObject(state, {
        ...state,
        steps: state.stepsLimit,
    });
}



function incrementSteps(state, action){
    let newSteps = Math.max(0, state.steps + action.value );
    return updateObject( state, {
        ...state,
        steps: newSteps,
    });
}



function incrementMoney(state, action){
    let newMoney = Math.max(0, state.money + action.value);
    return updateObject( state, {
        ...state,
        money: newMoney,
    });
}



function incrementTurn(state, action){
    let newTurn = Math.max( 0, state.turn + action.value );
    return updateObject( state, {
        ...state,
        turn: newTurn,
    });
}




function togglePlayerDirection(state) {
    const dir = (state.statuses[Constant.PLAYER_ID].direction === Constant.DIRECTION.right ) ? Constant.DIRECTION.left : Constant.DIRECTION.right ;
    return Update( state, {
        statuses: {
            [Constant.PLAYER_ID]: {
                direction: { $set: dir }
            }
        }
    });
}




function setEntityDirection(state, action){
    const entityKey = action.entityKey;
    const direction = action.direction;
    return Update(state, {
        statuses: {
            [entityKey]: {
                direction: { $set: direction }
            }
        }
    });
}




/**
 * Generate Entities based on level, including setting up statuses
 * @param {*} state 
 * @param {*} action 
 */
function generateEntitiesInBattle(state, action){
    let newEntitiesStatus = JSON.parse(JSON.stringify( action.level.entities ));
    let entities = [];
    
    for (let key in newEntitiesStatus ){
        //SetUp
        delete newEntitiesStatus[key].Coord;
        let entity = Entity.default[ newEntitiesStatus[key].type.toString() ];
        newEntitiesStatus[key].health = entity.health;
        newEntitiesStatus[key].healthLimit = entity.health;
        newEntitiesStatus[key].reward = entity.reward;
        newEntitiesStatus[key].direction = Constant.DIRECTION.left;
        newEntitiesStatus[key].attack = entity.attack;
        entities.push(key);
    }
    return updateObject( state, {
        ...state,
        entities: entities,
        statuses: {
            ...state.statuses,
            ...newEntitiesStatus
        }
    });
}





function incrementHealth(state, action){
    const entityKey = ( action.entityKey !== undefined) ? action.entityKey : PLAYER_ID;
    const status = state.statuses[entityKey];
    const value = action.value;

    let newHP = Math.max(0,  status.health + value );
        newHP = Math.min(newHP, status.healthLimit );

    return Update(state, {
        statuses: {
            [entityKey]: {
                health: { $set: newHP }
            }
        }
    });
}



function incrementHealthLimit(state, action){
    const entityKey = ( action.entityKey !== undefined) ? action.entityKey : PLAYER_ID;
    const status = state.statuses[entityKey];
    const value = action.value;

    const HPLimit = Math.max(0, status.healthLimit + value );

    return Update(state, {
        statuses: {
            [entityKey]: {
                healthLimit: { $set: HPLimit }
            }
        }
    });
}


/**
 * Updating status after getting attacked reduce that target's health
 * @param {*} state 
 * @param {*} action entityKey
 */
function getAttacked(state, action){
    const hostKey = ( action.hostKey !== undefined) ? action.hostKey : PLAYER_ID;
    const targetKey = ( action.targetKey !== undefined) ? action.targetKey : PLAYER_ID;

    const hostStatus = state.statuses[hostKey];
    const targetStatus = state.statuses[targetKey];
    if (targetStatus === undefined || hostStatus === undefined ){
        return state;
    }

    //Damage Calculation
    let actualDmg = ( hostStatus.attack !== undefined ) ? hostStatus.attack : 0;
    actualDmg += (action.damage !== undefined ) ? action.damage : 0;
    
    //Health calculation
    const newHP = Math.max(0, targetStatus.health - actualDmg );

    return Update( state, {
        statuses: {
            [targetKey]: {
               health: { $set: newHP }
            }
        }
    })

}



/**
 * Entity getting defeated by the player, remove it from store
 * @param {*} state 
 * @param {*} action entityKey
 */
function defeatEntity(state, action){
    const entityKey = action.entityKey;
    if (state.statuses[entityKey] === undefined){ 
        return state; 
    }
    
    const reward = state.statuses[entityKey].reward ?? 0;
    const newMoney = Math.min( Number.MAX_SAFE_INTEGER, state.money + reward );

    //alert(entityKey);

    //destructure to delete
    const { [entityKey]: value , ...newEntitiesStatus } = state.statuses;
    const newEntity = state.entities.filter( a => a !== entityKey ); 

    return updateObject(state, {
        ...state,
        money: newMoney,
        entities: newEntity,
        statuses: newEntitiesStatus,
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
        case Action.GameStatusAction.RESET_STEP:
            return resetStep(state);
        case Action.GameStatusAction.INCREMENT_STEPS:
            return incrementSteps(state, action);
        case Action.GameStatusAction.INCREMENT_HEALTH:
            return incrementHealth(state, action);        
        case Action.GameStatusAction.INCREMENT_MONEY:
            return incrementMoney(state, action);  
        case Action.GameStatusAction.ATTACK:
            return getAttacked(state, action);
        case Action.GameStatusAction.ENTITY_DEFEAT:
            return defeatEntity(state, action);
        case Action.GameStatusAction.INCREMENT_TURN:
            return incrementTurn(state, action);
        case Action.GameStatusAction.SET_INPUT_LOCK:
            return setInputLock(state, action);
        case Action.GameStatusAction.SET_PLAYER_DIRECTION:
            return togglePlayerDirection(state);
        case Action.GameStatusAction.SET_ENTITY_DIRECTION:
            return setEntityDirection(state, action);
        default:
            return state;  
    }
}