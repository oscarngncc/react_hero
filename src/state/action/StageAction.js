
import makeActionCreator from './actionCreator';
import * as Event from './../../data/event/Event';

/**
 *  Game Map Related
 */
export const GENERATE_GAMEMAP = "generateGameMap";
export const GENERATE_BATTLEMAP = "generateBattleMap";

export const MOVE_PLAYER_GAMEMAP = "movePlayerInMap";
export const MOVE_PLAYER_BATTLEMAP = "movePlayerInBattle";

export const GENERATE_EVENT = "generateEvent";

export const LEFT = "left";
export const RIGHT = "right";
export const TOP = "top";
export const DOWN = "down";


const stageRow = 4;
const stageColumn = 5;



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


    while (yPos != nextYPos){
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

  console.table(gameMap);
  return {
    type: GENERATE_GAMEMAP,
    map: gameMap,
    row: rows,
    col: columns,
    startCoord: startCoord,
  }
}



/**
 * Action creator for Generate Battle Arena 
 */
export function generateBattleMap(){
  let battleMap = Array(stageRow).fill().map(() => Array(stageColumn).fill(0));
  
  console.table(battleMap);
  return {
    type: GENERATE_BATTLEMAP,
    map: battleMap,
    row: stageRow,
    col: stageColumn,
  }
}



/**
 * action creator for generating random events for gameMap
 * Note: It doesn't initialize the Player, the player will be initialized in reducer instead
 * @param {number} pathLength length of path, should be the same for generateGamePath
 * @return Action containing 2D array of randomized events
 */
export function generateEvent(pathLength){
  let rows = stageRow;
  let cols = pathLength;
  let eventsInMap = Array(rows).fill().map(() => Array(cols).fill( Event.EMPTY  ));
  return {
    type: GENERATE_EVENT,
    map: eventsInMap,
  }
}




export const movePlayerInMap = makeActionCreator(MOVE_PLAYER_GAMEMAP, 'Coord');
export const movePlayerInBattle = makeActionCreator(MOVE_PLAYER_BATTLEMAP, 'Coord');