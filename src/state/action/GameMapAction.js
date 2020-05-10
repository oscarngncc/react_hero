
import makeActionCreator from './actionCreator';

/**
 *  Game Map Related
 */
export const GENERATE_GAMEMAP = "generateGameMap";
export const MOVE_PLAYER = "movePlayer";
/**
 * Generating GamePath (Action creator, avoid impure reducer)
 * @param {*} pathLength the length of the path
 * @param {*} splitChanceNum the maximum number of an additional path besides the block be added
 */
export function generateGamePath(pathLength, splitChanceNum ){
  
  //[row][column]
  let rows = 4;
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

  let numOfFilled = 0;
  for ( xPos; xPos < columns; xPos++ ){
    let nextYPos = nextChoice();
    yPos = (xPos == 0) ? nextYPos : yPos; 

    while (yPos != nextYPos){
      let step = (yPos < nextYPos ) ? 1 : -1;
      gameMap[xPos][yPos] = FILED_TILE;  //Fill
      yPos += step;
    }
    gameMap[xPos][yPos] = FILED_TILE;  //Fill
  }

  for ( let i = 0; i < splitChanceNum; i++ ){
    let xRar = Math.floor(Math.random() * rows);
    let yRar = Math.floor(Math.random() * columns);
    if (gameMap[xRar][yRar] == EMPTY_TILE ){
      
      let canConnect = true;
      if (xRar - 1 >= 0 && gameMap[xRar-1][yRar] != EMPTY_TILE ){}
      else if (xRar + 1 < rows && gameMap[xRar+1][yRar] != EMPTY_TILE ){}
      else if (yRar - 1 >= 0 && gameMap[xRar][yRar-1] != EMPTY_TILE ){}
      else if (yRar + 1 < columns && gameMap[xRar][yRar+1] != EMPTY_TILE ){}
      else canConnect = false;
      
      if (canConnect){
        gameMap[xRar][yRar] = FILED_TILE;
      }
    }
  }
  return {
    type: GENERATE_GAMEMAP,
    map: gameMap,
    row: rows,
    col: columns,
  }
}