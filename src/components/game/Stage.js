
import React, {useState, useRef} from 'react';
import { useSpring, useTrail, animated, useChain } from 'react-spring';
import {useSelector, useDispatch} from 'react-redux';

import Style from './../../css/Style.module.css';
import * as Action from './../../state/action/action';
import * as Tile from './../../data/tile/Tile';
import * as Event from './../../data/event/Event';
import ClickableCircle from './../ui/ClickableCircle';
import Player from './../game/Player';
import EnemyInMap from './../game/EntityInMap';



export default function Stage(props){

    let dispatch = useDispatch();
    const [isToNextLevel, setToNextLevel] = useState(false);

    const rowLen = 4;
    const colLen = 5;
    const totalLen = rowLen * colLen;

    const isBattle = useSelector(state => state.game.isBattle);
    const gameMap = useSelector(state => state.map.gameMap );
    const battleMap = useSelector(state => state.map.battleMap );
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


    /* This should be the only ones used by the presentation layer */
    const currentMap = (isBattle) ? battleMap : partOfGameMap;
    const currentPlayerCoord = (isBattle) ? playerBattleCoord : partOfGameCoord;
    



    const initMapRef = useRef();
    const initMap = useSpring({
        from: { transform: "translateY(-150rem)"},
        to: { transform: "translateX(0rem)"},
        config:  { mass: 5, tension: 400, friction: 60 },
    });
    const initTrailRef = useRef();
    const initTrail = useTrail( totalLen, {
       from: { transform: "translateY(-150rem)"},
       to: { transform: "translateY(0rem)"},
       config:  { mass: 4, tension: 2000, friction: 140 },
       delay: 600,
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
     * get actual column value in the whole gamemap from column value of part of the gamemap
     * @param {number} column column value presented in "partOf" (presentation layer)
     */
    function getFullColumnFromPart(column){
        console.log(column % (colLen) + partIndex);
        return column % (colLen) + partIndex;
    }
    


    /**
     * Move the Player in Map, usable for both map and battle
     * @param {*} row 
     * @param {*} column 
     */
    function movePlayer(row, column){
        if ( isBattle ){
            let coord = { x: column, y: row };
            let move = Action.StageAction.movePlayerInBattle(coord);
            dispatch(move);
        }
        else {
            let coord = {  x: getFullColumnFromPart(column), y: row,};
            let move = Action.StageAction.movePlayerInMap(coord);
            if ( column===colLen -1 ){
                setToNextLevel(true);
            }
            dispatch(move);
        }
    }



    /**
     * Render child in map. Noted that it's based off the map itself
     * @param {number} row 
     * @param {number} column 
     */
    function renderMapChild(row, column){
        switch ( partOfEventMap[row][column] ){
            case Event.PLAYER:
                return <Player/>;
            case Event.ENEMY:
                return <EnemyInMap/>;
            default:
                if (checkMovable(row, column, 1, false )){
                    return (<ClickableCircle click={() => movePlayer(row, column) } />);
                }
        }
        return <div></div>;
    }


    /**
     * Render child in battle, incomplete
     * @param {*} row 
     * @param {*} column 
     */
    function renderBattleChild(row, column){
        if (currentPlayerCoord.y === row && currentPlayerCoord.x === column ){
            return <Player/>;
        }
        else if (checkMovable(row, column, 1, false )){
            return (<ClickableCircle click={() => movePlayer(row, column) } />);
        }
        return <div></div>;
    }



    function renderChild(row, column){
        return (isBattle) ? renderBattleChild(row, column) : renderMapChild(row, column);
    }

    

    let nextLevelStyle = (isToNextLevel) ? nextLevelSpring : {};
    return (
        <div class={Style.stage}>
            <animated.div class={Style.gameMap} style={Object.assign(initMap, nextLevelStyle)} >
                <ul class={Style.tileMap}>
                    {currentMap.map((row, rowIndex) => {
                        return row.map((column, colIndex) => {
                        
                            var index = rowIndex * 5 + colIndex;
                            var tileStyle = Tile.default[column.toString()].style;  
                            
                            return (
                                <animated.li 
                                class={Style.floorUnit}
                                key={"tile" + index.toString()} 
                                style={  Object.assign(initTrail[index], tileStyle ) }
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


