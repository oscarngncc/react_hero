

import React from 'react'
import Tile from '../data/tile/Tile';
import { STAGE_ROW, STAGE_COL } from '../state/constant';

export default function useMovable( tileMap, currentPlayerCoord, moveDist, canAdjacent ) {
    
    const result = new Array( STAGE_ROW ).fill(false).map(() => new Array( STAGE_COL ).fill(false));

    const delta = [ 
        {x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1},   
        {x:1, y:1}, {x:-1, y:1}, {x:1, y:-1}, {x:-1, y:-1},  
    ]

    for (var i = 0; i <  4 * (canAdjacent ? 2:1) ; i++ ){        
        for (var j = 1; j <= moveDist; j++ ){
            const x = delta[i].x * j + currentPlayerCoord.x;
            const y = delta[i].y * j + currentPlayerCoord.y;
            
            if ( x < 0 || y < 0 || y >= STAGE_ROW || x >= STAGE_COL ){
                continue;
            }
            else if ( tileMap[y][x] === Tile.NULL_TILE || tileMap[y][x] === Tile.UNMOVEABLETILE  ){
                continue;
            }
            else {
                result[y][x] = true;
            }

        }
    }
    return result;
}
