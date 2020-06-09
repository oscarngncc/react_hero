
import React, {useCallback, useState, useRef, useEffect} from 'react';
import { useSpring, useTrail, animated, useChain } from 'react-spring';
import {useSelector, useDispatch} from 'react-redux';
import { useDrop } from 'react-dnd';

import Style from './../../css/Style.module.css';
import * as Action from './../../state/action/action';
import * as Tile from './../../data/tile/Tile';
import * as Event from './../../data/event/Event';
import ClickableCircle from './../ui/ClickableCircle';
import Player from './../game/Player';
import EnemyInMap from './../game/EntityInMap';
import Entity from './Entity';

import CardData from './../../data/card/Card';
import EntityData from './../../data/entity/Entity';
import EffectWrapper from './EffectWrapper';




export default function Stage(props){

    const dispatch = useDispatch();
    const [isToNextLevel, setToNextLevel] = useState(false);
    const [consumedCard, setConsumedCard] = useState(null);
    
    //NOT IDEAL!! USED FOR REFRESH GIF
    const [refresh, setRefresh] = useState( Math.random()  );


    const rowLen = 4;
    const colLen = 5;
    const totalLen = rowLen * colLen;

    const isBattle = useSelector(state => state.game.isBattle);
    const gameMap = useSelector(state => state.map.gameMap );
    const battleMap = useSelector(state => state.map.battleMap );
    const eventInMap = useSelector(state => state.map.eventInMap );
    const playerGameCoord = useSelector(state => state.map.playerGameMapCoord);
    const playerBattleCoord = useSelector( state => state.map.playerBattleMapCoord);
    const entitiesBattleCoords = useSelector( state => state.map.entityInMap);
    const BattleSteps = useSelector(state => state.game.steps);
    const turn = useSelector(state => state.game.turn );


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

    //entity Statuses
    const entitiesStatus = useSelector( state => state.game.entitiesStatus );
    const entitiesInMap = useSelector(state => state.map.entityInMap );


    if (partOfGameMap[0].length < colLen ){
        for ( let i = 0; i < partOfGameMap.length; i++  ){
            while (partOfGameMap[i].length < colLen ){
                partOfGameMap[i].push(Tile.NULL_TILE);
                partOfEventMap[i].push(Event.EMPTY);
            }
        }
    }

    //This should be the only ones used by the presentation layer 
    const currentMap = (isBattle) ? battleMap : partOfGameMap;
    const currentPlayerCoord = (isBattle) ? playerBattleCoord : partOfGameCoord;
    




    /**
     * Perform Action by certain entity
     */
    function performEntityAction(key){

        const type = entitiesStatus[key].type;
        const Coord = entitiesInMap[key].Coord;
        const distance = EntityData[type].distance;
        const style = EntityData[type].style;

        var actions = [];
        for ( var i = 0; i < distance; i++ ){
            actions.push(Action.StageAction.moveEntityInBattle(key, style, playerBattleCoord));
        }

        actions.map( function(action, index){
            setTimeout( () => {
                dispatch(action)
            }, 100 + index * 500 );
        });
    }




    /**
     * Generator Function
     * @param {Function} resume function which has ability to call generator.next() on top of callback func
     */
    function* performEntitiesAction(resume){ 
        
        /**
         * simple async function that will be yielded (here used as delay between entity who sequence of action)
         * @param {*} time time needed to wait for this async func to execute
         * @param {*} callback will actually be plugged with function resume()  
         * @param {*} key unique key of the entity
         */
        function delay(time, callback, key) {
            setTimeout(function () {
              callback(key);
            }, time);
        }

        for ( var index = 0; index < Object.keys(entitiesStatus).length; index++ ){
            const key = Object.keys(entitiesStatus)[index];
            const time = index === 0 ? 0 : 1600;
            yield delay( time, resume, key );
        }
    }
     

    
    /**
     * Helper function for the generator
     * @param {*} generatorFunction 
     */
    function run(generatorFunction) {
        /**
         * What resume does here is to call our async function AND 
         * @param {*} key unique entity key obtained from generator.delay()
         */
        function resume(key) {
            performEntityAction(key);
            generatorItr.next();
        }
        var generatorItr = generatorFunction(resume);
        generatorItr.next();
    }


    
    /**
     * Perform Entity Action upon turn gets updated
     * Including: Doing action one by one
     */
    useEffect(() => {
        if (turn >= 2 ){
            run(performEntitiesAction);
        }
    }, [turn])

   

    useEffect(() => {    
        //Unmount child entity if target has no health
        Object.keys(entitiesStatus).forEach( function(key){
            if (entitiesStatus[key].health <= 0){
                dispatch(Action.GameStatusAction.entityDefeated(key));       
            }
        });
        //Reset battlemap back if all entities defeated
        if ( Object.keys(entitiesStatus).length === 0 ){
            dispatch(Action.GameStatusAction.startBattle(false));
        }
    });



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
       config:  { mass: 4, tension: 2000, friction: 140 },
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
     * DND-Droppable
     * drop: only care about return undefined or not
     */
    const [{ item, isOver, canDrop }, drop] = useDrop({
        accept: 'Card',
        drop: () => { consumeCard(item); return item; },  
        collect: (monitor) => ({
            item: monitor.getItem(),
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });



    /** 
     * use the card, including using its effect and discard it
     * NOTE: While it seem's weird to handle Card action here, it actually kinda make sense
     * Upon dropping here, the card effect will also have impact on the map itself
     * @param {object} item dragged object info defined by drag-N-drop Card 
    */
    function consumeCard(item){
        const index = item.index;
        const Card = CardData[item.card];

        let usable = true;
        for (var condition in Card.effect ){
        }
        if (!usable){ return; }

        //Force Update of the dragged card
        setConsumedCard(null);  
        setConsumedCard(item);
        setRefresh(Math.random());
        for (var action in Card.effect ){
            dispatch( Card.effect[action](playerBattleCoord, entitiesBattleCoords)  );
        }  
        dispatch(Action.CardAction.discardCard(index) );
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
     * Based on row/column, check if entity exists on that pane
     * @param {number} row 
     * @param {number} column 
     * @returns {string} unique key of the entity in BattleMap, null otherwise
     */
    function checkEntityCoord(row, column){
        for (let key in entitiesBattleCoords ){
            if ( entitiesBattleCoords[key]["Coord"].y === row && entitiesBattleCoords[key]["Coord"].x === column){
                return key;
            }
        }
        return null;
    }

    

    
    /**
     * get actual column value in the whole gamemap from column value of part of the gamemap
     * @param {number} column column value presented in "partOf" (presentation layer)
     */
    function getFullColumnFromPart(column){
        return column % (colLen) + partIndex;
    }
    


    /**
     * Move the Player in Map, usable for both map and battle
     * NOTE: this function is passed to the child component as an onClickEvent
     * @param {number} row 
     * @param {number} column 
     */
    function movePlayer(row, column){
        if (consumeCard !== null ){
            setConsumedCard(null);
        }

        if ( isBattle ){
            let coord = { x: column, y: row };
            let move = Action.StageAction.movePlayerInBattle(coord);
            dispatch(move);
            dispatch(Action.GameStatusAction.incrementStep(-1));
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
    * Trigger general Event effect upon onclick
     * including: remove event, move player to there
    * @param {*} row Y index of the event
    * @param {*} column X index of the event
    */
    function onClickEvent(row, column){
        let coord = { x: column, y: row };
        dispatch(Action.StageAction.clearEventInMap(coord));
        dispatch(Action.StageAction.movePlayerInMap(coord));
    }



    /**
     * Check if the tile will be in range of player's card upon drag-n-drop a specific card
     * @param {number} row row of the tile
     * @param {number} column column of the tile
     * @param {String} cardID  card ID of the card (e.g. "forward")
     * @return {boolean} true if it will be
     */
    function checkTargetTile(row, column, cardID){
        const Card = CardData[cardID];
        const target = Card.target;
        if (target === undefined){
            return false;
        }
        for (let i = 0; i < target.length; i++ ){
            if ( row === currentPlayerCoord.y + target[i].y && column === currentPlayerCoord.x + target[i].x  ){
                return true;
            }
        }
        return false;
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
                return <div onClick={() => onClickEvent(row, column)}><EnemyInMap/></div>;
            default:
                if (checkMovable(row, column, 1, false) && ! isToNextLevel ){
                    return (<ClickableCircle click={() => movePlayer(row, column) } />);
                }
        }
        return <div></div>;
    }


    

    /**
     * Render child in battle map, incomplete
     * @param {number} row 
     * @param {number} column 
     */
    function renderBattleChild(row, column){
        
        let child = null;
        
        if (currentPlayerCoord.y === row && currentPlayerCoord.x === column ){
            child = <Player key="Player" />;
        }
        else if ( checkEntityCoord(row, column) !== null ){
            const key = checkEntityCoord(row, column);
            const attackable = checkMovable(row, column, 1, false) && BattleSteps > 0 ;
            child = <Entity monsterKey={key} attackable={attackable}/>;
        }
        else if (checkMovable(row, column, 1, false) && BattleSteps > 0 ){
            child = (<ClickableCircle click={() => movePlayer(row, column) } />);
        }
        else { child = <div></div>;}

        const isEffect = (consumedCard !== null && checkTargetTile(row, column, consumedCard.card) ) ?  CardData[consumedCard.card].particle : undefined;
        return <EffectWrapper effect={isEffect} refresh={refresh} >{child} </EffectWrapper>;
    }



    /**
     * render child depending on the map is used as battle or walkthrough
     * @param {number} row 
     * @param {number} column 
     */
    function renderChild(row, column){
        return (isBattle) ? renderBattleChild(row, column) : renderMapChild(row, column);
    }



    const nextLevelStyle = (isToNextLevel) ? nextLevelSpring : {};
    const dragMapStyle = (isOver) ? { boxShadow: "0 40px 100px -10px rgba(50, 50, 73, 0.4), 0 40px 40px -10px rgba(50, 50, 73, 0.3)"} : {};
    return (
        <div class={Style.stage} ref={drop} >
            <animated.div class={Style.gameMap} style={ {...initMap, ...nextLevelStyle, ...dragMapStyle }  } >
                <ul class={Style.tileMap}>
                    {currentMap.map((row, rowIndex) => {
                        return row.map((column, colIndex) => {
                        
                            let index = rowIndex * 5 + colIndex;
                            let tileStyle = Tile.default[column.toString()].style;  

                            //Change to Attack Tile upon hover
                            if (isOver && checkTargetTile(rowIndex, colIndex, item.card) ){
                                tileStyle = Tile.default[Tile.ATTACK_TILE].style;
                            }
                            
                            return (
                                <animated.li 
                                class={Style.floorUnit}
                                key={"tile" + index.toString()} 
                                style={  { ...initTrail[index], ...tileStyle}  }
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

