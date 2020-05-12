
import React, {useState, useRef} from 'react';
import { useSpring, useTrail, animated, useChain } from 'react-spring';
import {useSelector, useDispatch} from 'react-redux';

import Style from './../../css/Style.module.css';
import PositionComponent from './../misc/PositionComponent';
import * as Action from './../../state/action/action';
import * as Tile from './../../data/tile/Tile';
import * as Event from './../../data/event/Event';
import ClickableCircle from './../ui/ClickableCircle';



export default function Stage(props){

    let dispatch = useDispatch();

    const rowLen = 4;
    const colLen = 5;
    const totalLen = rowLen * colLen;

    const isBattle = useSelector(state => state.game.isBattle);
    const gameMap = useSelector(state => state.map.gameMap );
    const battleMap = useSelector(state => state.map.gameMap );
    const eventInMap = useSelector(state => state.map.eventInMap );
    const playerGameCoord = useSelector(state => state.map.playerGameMapCoord);
    const playerBattleCoord = useSelector( state => state.map.playerBattleMapCoord);
    

    //Placeholder, shouldn't be in use
    const defaultMap = [    
        [0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0,],
    ];

    const partIndex = Math.floor(playerGameCoord.x / (colLen-1) ) * (colLen-1);
    const partOfGameMap = (gameMap !== null && gameMap.length != 0 ) ? gameMap.slice(0, rowLen).map(i => i.slice( partIndex, partIndex + colLen)) : defaultMap;
    const partOfEventMap = (eventInMap !== null && eventInMap.length != 0  ) ? eventInMap.slice(0, rowLen).map(i => i.slice(partIndex, partIndex + colLen)) : defaultMap;
    const partOfGameCoord = { x: playerGameCoord.x % (colLen-1), y : playerGameCoord.y  };

    if (partOfGameMap[0].length < colLen ){
        for ( let i = 0; i < partOfGameMap.length; i++  ){
            while (partOfGameMap[i].length < colLen ){
                partOfGameMap[i].push(Tile.NULL_TILE);
                partOfEventMap[i].push(Event.EMPTY);
            }
        }
    }

    console.table(partOfGameMap);


    const currentMap = (isBattle) ? battleMap : partOfGameMap;


    const initMapRef = useRef();
    const initMap = useSpring({
        from: { transform: "translateY(-150rem)"},
        to: { transform: "translateX(0rem)"},
        config:  { mass: 5, tension: 400, friction: 60 },
    });
    const initTrailRef = useRef();
    const initTrail = useTrail( totalLen, {
       from: { transform: "translateY(-150rem)"},
       to: { transform: "translateX(0rem)"},
       config:  { mass: 4, tension: 2000, friction: 140 },
       delay: 600,
    });
    useChain([initMapRef, initTrailRef]);


    /**
     * Conditional checking whether the player can move to that tile
     * Can be used for both battle map and game map
     * @param {number} row target coordinate
     * @param {number} col target coordinate
     * @param {number} moveDist distance player allowed to move
     * @param {boolean} canAdjacent whether player can move adjacent or not
     */
    function checkMovable(row, col, moveDist, canAdjacent ){

        if (col < 0 || row < 0 || row >= rowLen || col >= colLen ){
            return false;
        }
        if (partOfGameMap[row][col] === Tile.NULL_TILE ){
            return false;
        }
        if (partOfGameMap[row][col] === Tile.UNMOVEABLETILE ){
            return false;
        }
        
        let Coord = (isBattle) ? playerBattleCoord : partOfGameCoord;
        let DistX = Math.abs(Coord.x  - col);
        let DistY = Math.abs(Coord.y  - row);

        if (DistX > moveDist || DistY > moveDist ){
            return false;
        }
        
        if ( ! canAdjacent && (DistX !== 0 && DistY !== 0) ){
            return false;
        }

        return true;
    }
    
    
    /**
     * get actual column value
     * @param {number} column column value presented in "partOf" (presentation layer)
     */
    function getFullColumnFromPart(column){
        console.log(column % (colLen) + partIndex);
        return column % (colLen) + partIndex;
    }
    

    /**
     * Move the Player Buggy!
     * @param {*} row 
     * @param {*} column 
     */
    function movePlayer(row, column){

        let coord = {
            x: getFullColumnFromPart(column),
            y: row,
        };
        let move = (isBattle) ? Action.StageAction.movePlayerInBattle(coord) 
                            : Action.StageAction.movePlayerInMap(coord);
        dispatch(move);
    }




    function renderChild(row, column){
        switch (partOfEventMap[row][column] ){
            case Event.PLAYER:
                return (<h1>PLAYER</h1>);
            default:
                if (checkMovable(row, column, 1, false )){
                    return (<ClickableCircle click={() => movePlayer(row, column) } />);
                }
        }
        return <div></div>;
    }



    return (
        <div class={Style.stage}>
            <animated.div class={Style.gameMap} style={initMap}  >
                <ul class={Style.tileMap}>
                    {currentMap.map((row, rowIndex) => {
                        return row.map((column, colIndex) => {
                        
                            var index = rowIndex * 5 + colIndex;
                            var tileStyle = Tile.default[column.toString()].style;  
                            
                            return (
                                <animated.li 
                                class={Style.floorUnit}
                                key={"tile" + index.toString()} 
                                style={ 
                                    Object.assign(initTrail[index], tileStyle )
                                }
                                >
                                    {renderChild(rowIndex, colIndex)}
                                </animated.li> 
                            );
                        })
                    })}
                </ul>
            </animated.div>
        </div>
    );    
}


