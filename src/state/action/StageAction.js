
import makeActionCreator from './actionCreator';
import * as Event from './../../data/event/Event';
import * as Tile from './../../data/tile/Tile';
import * as Entity from './../../data/entity/Entity';
import CardData from './../../data/card/Card';
import * as Level from '../../data/level/Level';
import * as Constant from './../constant';
import moveEntityInBattle, {MOVE_ENTITY_BATTLEMAP} from './StageEntityAction';


/**
 *  Game Map Related
 */
export const GENERATE_GAMEMAP = "generateGameMap";
export const GENERATE_BATTLEMAP = "generateBattleMap";
export const GENERATE_EVENT = "generateEvent";
export const GENERATE_LEVEL_BATTLE = "generateLevelInBattle";

export const MOVE_PLAYER_GAMEMAP = "movePlayerInMap";
export const MOVE_PLAYER_BATTLEMAP = "movePlayerInBattle";
export const CLEAR_EVENT_GAMEMAP = "clearEventInMap";
export const SET_PARTICLE_IN_MAP = "setParticleINMAP";


const stageRow = Constant.STAGE_ROW ;
const stageColumn = Constant.STAGE_COL ;


/**
 * Action creator for Generating GamePath (Action creator, avoid impure reducer)
 * @param {number} pathLength the length of the path
 * @param {number} splitChanceNum the maximum number of an additional path besides the block be added
 */
export function generateGamePath(pathLength, splitChanceNum ){
  //[row][column] or [y][x]
  let rows = stageRow;
  let columns = pathLength;
  let gameMap = Array(rows).fill().map(() => Array(columns).fill(0));

  let nextChoice = () => {
    return  Math.floor(Math.random() * rows);
  }

  let EMPTY_TILE = 0;
  let FILED_TILE = 1;

  //Random Value
  let yPos = 0;
  let xPos = 0;
  let startCoord = { x: 0, y: 0};

  let numOfFilled = 0;
  for ( xPos; xPos < columns; xPos++ ){
    let nextYPos = nextChoice();
  
    //Start Point
    if (xPos === 0 ){
      yPos = nextYPos;
      startCoord = { x: 0, y: yPos };
    }


    while (yPos !== nextYPos){
      let step = (yPos < nextYPos ) ? 1 : -1;
      gameMap[yPos][xPos] = FILED_TILE;  //Fill
      yPos += step;
    }
    gameMap[yPos][xPos] = FILED_TILE;  //Fill
  }

  for ( let i = 0; i < splitChanceNum; i++ ){
    let xRar = Math.floor(Math.random() * columns);
    let yRar = Math.floor(Math.random() * rows);
    if (gameMap[yRar][xRar] === EMPTY_TILE ){
      
      let canConnect = true;
      if (yRar - 1 >= 0 && gameMap[yRar-1][xRar] !== EMPTY_TILE ){}
      else if (yRar + 1 < rows && gameMap[yRar+1][xRar] !== EMPTY_TILE ){}
      else if (xRar - 1 >= 0 && gameMap[yRar][xRar-1] !== EMPTY_TILE ){}
      else if (xRar + 1 < columns && gameMap[yRar][xRar+1] !== EMPTY_TILE ){}
      else canConnect = false;
      
      if (canConnect){
        gameMap[yRar][xRar] = FILED_TILE;
      }
    }
  }

  return {
    type: GENERATE_GAMEMAP,
    map: gameMap,
    row: rows,
    col: columns,
    startCoord: startCoord,
  }
}



/**
 * action creator for generating random events for gameMap
 * Note: It doesn't initialize the Player, the player will be initialized in reducer instead
 * @param {number} pathLength length of path, should be the same for generateGamePath
 * @return Action containing 2D array of randomized events
 */
export function generateEvent(pathLength){
  return (dispatch, getState ) => {
    const rows = stageRow;
    const cols = pathLength;
    const gameMap = getState().map.gameMap ?? null;
    console.log(gameMap.length);
    if ( ! Array.isArray(gameMap) || gameMap.length === 0 || ! Array.isArray(gameMap[0]) || pathLength > gameMap[0].length  ){ 
      return; 
    }

    let eventsInMap = Array(rows).fill().map(() => Array(cols).fill( Event.EMPTY  ));

    for (let i = 0; i < 10; i++ ){
      const randX = Math.floor(Math.random() * rows );
      const randY = Math.floor(Math.random() * cols );
      const tile = gameMap[randX][randY] ?? null; 
      if (  tile !== null && Tile.default[tile].movable === true  ){
        eventsInMap[randX][randY] = Event.ENEMY;
      }
    }
    //Debug to always generate
    eventsInMap[2][2] = Event.ENEMY;

    dispatch({
      type: GENERATE_EVENT,
      map: eventsInMap,
    });
  }
}


export function setParticleWithCard(cardID, hostKey=Constant.PLAYER_ID ){
  return (dispatch, getState) => {
 
    const Card = CardData[cardID] ?? {};
    const {x, y} = (hostKey === Constant.PLAYER_ID) ? getState().map.playerBattleMapCoord : getState().map.entityInMap[hostKey].Coord;
    const userStatus = getState().game.statuses[hostKey] ?? {};
    const dirMultiplier = ( userStatus.direction === Constant.DIRECTION.left  ) ? -1 : 1;

    let newParticles = new Array(Constant.STAGE_ROW).fill(null).map(() => new Array(Constant.STAGE_COL).fill(null) );
    Card.target.map((target) => {
        const affectedY = y + target.y;
        const affectedX = x+ target.x * dirMultiplier;
        if (affectedY < Constant.STAGE_ROW && affectedY >= 0  && affectedX < Constant.STAGE_COL && affectedX >= 0 ){
            newParticles[affectedY][affectedX] = Card.particle ?? '';
        }
    });

    dispatch( setParticleInMap(newParticles) );
  }
}


/**
 * Action creator for Generate Battle Arena 
 */
export function generateBattleMap(){
  let battleMap = Array(stageRow).fill().map(() => Array(stageColumn).fill( Tile.NORMAL_TILE ));
  
  console.table(battleMap);
  return {
    type: GENERATE_BATTLEMAP,
    map: battleMap,
    row: stageRow,
    col: stageColumn,
  }
}



/**
 * Action creator for Generating Level in Battle Map
 */
export function generateLevelInBattle(){
  return {
    type: GENERATE_LEVEL_BATTLE,
    level: Level.base_2,
  }
}



/**
 * More Simple Action Creator
 */
export const clearEventInMap = makeActionCreator(CLEAR_EVENT_GAMEMAP, 'Coord');
export const movePlayerInMap = makeActionCreator(MOVE_PLAYER_GAMEMAP, 'Coord');
export const movePlayerInBattle = makeActionCreator(MOVE_PLAYER_BATTLEMAP, 'Coord');
const setParticleInMap = makeActionCreator(SET_PARTICLE_IN_MAP, 'map');

/**
 * export StageEntityAction
 */
export {moveEntityInBattle};
export {MOVE_ENTITY_BATTLEMAP};