

import makeActionCreator from './actionCreator';
import * as Event from './../../data/event/Event';
import * as Tile from './../../data/tile/Tile';
import * as Entity from './../../data/entity/Entity';
import * as Level from '../../data/level/Level';
import {DIRECTION, MOVE_STYLE, STAGE_ROW, STAGE_COL} from './../constant';


/**
 * This file is dedicated to movement of entities
 */
export const MOVE_ENTITY_BATTLEMAP = "moveEntityInBattle";
const stageRow = STAGE_ROW ;
const stageColumn = STAGE_COL ;


/**
 * A helper action-creator function that move an entity by only one unit
 * @param {*} entityKey entityKey
 * @param {*} Coord current coord of the entity
 * @param {String} direction based on {@link DIRECTION } 
 */
function moveEntityByOneUnit( entityKey, Coord, direction){
    switch (direction){
      case DIRECTION.top:
        return moveEntityInbattle_base(entityKey, {x: Coord.x, y: Coord.y - 1 } )
      case DIRECTION.down:
        return moveEntityInbattle_base(entityKey, {x: Coord.x, y: Coord.y + 1 } )
      case DIRECTION.left:
        return moveEntityInbattle_base(entityKey, {x: Coord.x - 1, y: Coord.y } )
      case DIRECTION.right:
        return moveEntityInbattle_base(entityKey, {x: Coord.x + 1, y: Coord.y } )
      default:
        alert("JOOJO");
        return {type: "MOVE_NOTHING" };
    }
}



/**
 * Move Entity in Random 
 * @see {@link moveEntityInBattle} for more detail
 * @param {*} key 
 * @param {*} Coord 
 * @param {*} distance 
 */
function moveEntityInRandom(key, Coord, distance){
    //Random Movement
    let remain = distance;
    let x = Math.floor( Math.random() * (remain + 1) );
    x *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
    x = (Coord.x == stageColumn - 1 ) ? Math.abs(x) * -1 : x;
    x = (Coord.x == 0 ) ? Math.abs(x) *  1 : x;
    remain = remain - Math.abs(x);
  
    let y = Math.floor( Math.random() * (remain + 1) );
    y *= Math.floor(Math.random() *2) == 1 ? 1 : -1;
    y = (Coord.y == stageRow - 1 ) ? Math.abs(y) * -1 : y;
    y = (Coord.y == 0 ) ? Math.abs(y) *  1 : y;
  
    const newCoord = {x: x + Coord.x, y: y + Coord.y };
    return moveEntityInbattle_base(key, newCoord) ;
}



/**
 * Move 1 step Based on Player Position, trying to move away from it as much as possible
 * @param {*} key 
 * @param {*} Coord 
 * @param {*} playerCoord 
 */
function moveEntityInDefense(key, Coord, playerCoord ){
    return (dispatch) => {
      const checkRow = () => {
        if (Coord.y <= playerCoord.y && Coord.y > 0  ){
          return moveEntityByOneUnit(key, Coord, DIRECTION.top );
        }
        if (Coord.y >= playerCoord.y ){  
          return moveEntityByOneUnit(key, Coord, DIRECTION.down );
        }
        return null;
      };
      const checkCol = () => {
        if (Coord.x <= playerCoord.x && Coord.x > 0 ){
          return moveEntityByOneUnit(key, Coord, DIRECTION.left );
        }
        if (Coord.x >= playerCoord.x ){ 
          return moveEntityByOneUnit(key, Coord, DIRECTION.right );
        }
        return null;
      };
        const XorYDirection = Math.floor(Math.random()*2) === 1 ? true : false;
        const rowAction = checkRow();
        const colAction = checkCol();
  
        if (XorYDirection){
          if (rowAction !== null){  dispatch(rowAction); }
          else if (colAction !== null ){ dispatch(colAction);}
        } else {
          if (colAction !== null ){ dispatch(colAction);}
          else if (rowAction !== null){  dispatch(rowAction); }
        }
    }
  }
  
  
  
  
/**
 * Move 1 step Based on Player Position, trying to follow it as much as possible
 * @param {*} key 
 * @param {*} Coord 
 * @param {*} playerCoord 
 */
function moveEntityInOffense(key, Coord, playerCoord ){
    return (dispatch) => {

        const checkRow = () => {
        if (Coord.y > playerCoord.y ){
            return moveEntityByOneUnit(key, Coord, DIRECTION.top );
        }
        else if (Coord.y < playerCoord.y ){  
            return moveEntityByOneUnit(key, Coord, DIRECTION.down );
        }
        else return null;
        };
        const checkCol = () => {
        if (Coord.x > playerCoord.x ){
            return moveEntityByOneUnit(key, Coord, DIRECTION.left );
        }
        else if (Coord.x < playerCoord.x ){ 
            return moveEntityByOneUnit(key, Coord, DIRECTION.right );
        }
        else return null;
        };
        const XorYDirection = Math.floor(Math.random()*2) === 1 ? true : false;
        const rowAction = checkRow();
        const colAction = checkCol();

        if (XorYDirection){
            if (rowAction !== null){  dispatch(rowAction); }
            else if (colAction !== null ){ dispatch(colAction);}
        } else {
            if (colAction !== null ){ dispatch(colAction);}
            else if (rowAction !== null){  dispatch(rowAction); }
        }
    }
}
  
  
/**
 * Move Entity though iteration
 * @param {*} key 
 * @param {*} Coord entity's coordinate
 */
export function moveEntityIterate(key, Coord){
    const horizontalDirection = Coord.y % 2 === 0 ? DIRECTION.left : DIRECTION.right;
    if ( (Coord.x === 0 && horizontalDirection === DIRECTION.left)  || (Coord.x === stageColumn - 1 && horizontalDirection === DIRECTION.right) ){
        return moveEntityByOneUnit(key, Coord, DIRECTION.down) ;
    }
    else {
        return moveEntityByOneUnit(key, Coord, horizontalDirection);
    }
}


/**
 * Move entity which teleport among all 4 random corner
 * @param {*} key 
 */
export function moveEntityCorner(key){
  const corner = Math.floor(Math.random()*4);
  switch (corner){
    case 0: return moveEntityInbattle_base(key, {x: 0, y: 0 })
    case 1: return moveEntityInbattle_base(key, {x: stageColumn, y: 0 })
    case 2: return moveEntityInbattle_base(key, {x: stageColumn, y: stageRow })
    case 3: return moveEntityInbattle_base(key, {x: 0, y: stageRow })
  }

}




/**
 * Depend on the entity style, move entity in battle by one step
 * @param {*} key entityKey
 * @param {*} style style of moving 
 * @param {*} playerCoord Coord of the current player
 */
export default function moveEntityInBattle( key, style = MOVE_STYLE.random, playerCoord = undefined ){
    return (dispatch, getState) => {
        const Coord = getState().map.entityInMap[key].Coord ;
        const distance = 1;

        switch (style) {
        case MOVE_STYLE.random:
            dispatch(moveEntityInRandom(key, Coord, distance)); break;
        case MOVE_STYLE.offense:
            dispatch( moveEntityInOffense(key, Coord, playerCoord )); break;
        case MOVE_STYLE.defense:
            dispatch( moveEntityInDefense(key, Coord, playerCoord) ); break;
        case MOVE_STYLE.iterateMap:
            dispatch( moveEntityIterate(key, Coord) ); break;
        case MOVE_STYLE.idle:
            break;
        case MOVE_STYLE.corner:
            dispatch(moveEntityCorner(key)); break;
        default:
            dispatch(moveEntityInRandom(key, Coord, distance)); 
        }
    }
}
  


const moveEntityInbattle_base = makeActionCreator(MOVE_ENTITY_BATTLEMAP, 'entityKey', 'Coord'); 