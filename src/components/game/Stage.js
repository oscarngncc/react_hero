
import React, {useState, useEffect, useRef} from 'react';
import { useSpring, useTrail, animated, useChain } from 'react-spring';
import {useSelector, useDispatch} from 'react-redux';

import Style from './../../css/Style.module.css';
import * as Action from '../../state/action/action';
import * as Tile from '../../data/tile/Tile';
import * as Event from '../../data/event/Event';
import ClickableCircle from '../ui/ClickableCircle';
import Player from './Player';
import EventComponent from './Event';
import {STAGE_COL, STAGE_ROW} from '../../state/constant';



export default function Stage(props){

    const dispatch = useDispatch();
    const [isToNextLevel, setToNextLevel] = useState(false);

    const rowLen = STAGE_ROW;
    const colLen = STAGE_COL;
    const totalLen = rowLen * colLen;

    
    const isBattle = useSelector(state => state.game.isBattle);
    const gameMap = useSelector(state => state.map.gameMap );
    const eventInMap = useSelector(state => state.map.eventInMap );
    const playerGameCoord = useSelector(state => state.map.playerGameMapCoord);


    //Placeholder, shouldn't be in use
    const defaultMap = [    
        [0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0,],
    ];

    const partIndex = Math.floor(playerGameCoord.x / (colLen-1) ) * (colLen-1);
    const partOfGameMap = (gameMap !== null && gameMap.length !== 0 ) ? gameMap.slice(0, rowLen).map(i => i.slice( partIndex, partIndex + colLen)) : defaultMap;
    const partOfEventMap = (eventInMap !== null && eventInMap.length !== 0  ) ? eventInMap.slice(0, rowLen).map(i => i.slice(partIndex, partIndex + colLen)) : defaultMap;
    const partOfGameCoord = { x: playerGameCoord.x % (colLen-1), y : playerGameCoord.y  };


    if (partOfGameMap[0].length < colLen ){
        for ( let i = 0; i < partOfGameMap.length; i++  ){
            while (partOfGameMap[i].length < colLen ){
                partOfGameMap[i].push(Tile.NULL_TILE);
                partOfEventMap[i].push(Event.EMPTY);
            }
        }
    }

    //This should be the only ones used by the presentation layer 
    const currentMap = partOfGameMap;
    const currentPlayerCoord = partOfGameCoord;



    /**
     * get actual coordinate in the whole gamemap based on partial of the gamemap
     * @param {number} column column value presented in "partOf" (presentation layer)
     */
    function getFullCoordFromPart(row, column){
        return { x: column % (colLen) + partIndex, y: row };
    }
 

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
        if ( currentMap[row][col] === Tile.NULL_TILE ){
            return false;
        }
        if ( currentMap[row][col] === Tile.UNMOVEABLETILE ){
            return false;
        }
        let Coord = currentPlayerCoord;
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
     * Move the Player in Map, usable for both map and battle
     * NOTE: this function is passed to the child component as an onClickEvent
     * @param {number} row 
     * @param {number} column 
     */
    function movePlayer(row, column){
        let coord = getFullCoordFromPart(row, column);
        let move = Action.StageAction.movePlayerInMap(coord);
        if ( column===colLen -1 ){
            setToNextLevel(true);
        }
        dispatch(move);
    }


   /**
    * Trigger general Event effect upon onclick
     * including: remove event, move player to there
    * @param {*} row Y index of the event
    * @param {*} column X index of the event
    */
    function onClickEvent(row, column){
        let coord = getFullCoordFromPart(row, column);
        dispatch(Action.StageAction.clearEventInMap(coord));
        dispatch(Action.StageAction.movePlayerInMap(coord));
    }



    /* ------ Animation Related ------ */
    const initMapRef = useRef();
    const initMap = useSpring({
        from: { transform: "translateY(-150rem)"},
        to: { transform: "translateX(0rem)"},
        config:  { mass: 5, tension: 400, friction: 60 },
        ref: initMapRef,
    });
    const initTrailRef = useRef();
    const initTrail = useTrail( totalLen, {
    from: { transform: "translateY(-150rem)"},
    to: { transform: "translateY(0rem)"},
    config:  { mass: 4, tension: 2000, friction: 135 },
    ref: initTrailRef,
    });
    useChain([initMapRef, initTrailRef]);

    const nextLevelSpring = useSpring({
        from: { transform: "translateX(5rem)", opacity: 0.7 },
        to: { transform: "translateX(0rem)", opacity: 1 },
        reset: true,
        onRest: () => {
            if (isToNextLevel){
                setToNextLevel(false);
            }
        } 
    })

    
    

    /**
     * Render child in map. Noted that it's based off the map itself
     * @param {number} row 
     * @param {number} column 
     */
    function renderMapChild(row, column){
        const eventKey = partOfEventMap[row][column];
        switch ( eventKey ){
            case Event.PLAYER:
                return <Player key="Player" />
            case Event.EMPTY:
                if (checkMovable(row, column, 1, false) && ! isToNextLevel  ){
                    return (<ClickableCircle click={() => movePlayer(row, column) } />);
                }
                else return <div></div>;
            default:
                return <div onClick={() => onClickEvent(row, column)}><EventComponent eventKey={eventKey} /></div>;
        }
    }


    const hideFromBattle = (isBattle) ? {display: "none"} : {};
    const nextLevelStyle = (isToNextLevel) ? nextLevelSpring : {};
    return (
        <div class={Style.stage} style={hideFromBattle} >
            <animated.div class={Style.gameMap} style={ {...initMap, ...nextLevelStyle }  } >
                <ul class={Style.tileMap}>
                    {currentMap.map((row, rowIndex) => {
                        return row.map((column, colIndex) => {
                        
                            let index = rowIndex * STAGE_COL + colIndex;
                            let tileStyle = Tile.default[column.toString()].style;  
                            return (
                                <animated.li 
                                class={Style.floorUnit}
                                key={"tile" + index.toString()} 
                                style={  { ...initTrail[index], ...tileStyle}  }
                                >
                                    {renderMapChild(rowIndex, colIndex)}
                                </animated.li> 
                            );
                        })
                    })}
                </ul>
            </animated.div>
        </div>
    );    
}

