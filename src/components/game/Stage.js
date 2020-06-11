
import React, {useState, useRef, useEffect} from 'react';
import { useSpring, useTrail, animated, useChain } from 'react-spring';
import {useSelector, useDispatch} from 'react-redux';
import { useDrop } from 'react-dnd';

import Style from './../../css/Style.module.css';
import * as Action from './../../state/action/action';
import * as Tile from './../../data/tile/Tile';
import * as Event from './../../data/event/Event';
import ClickableCircle from './../ui/ClickableCircle';
import Player from './../game/Player';
import EventComponent from './../game/Event';
import Entity from './Entity';
import * as Constant from './../../state/constant';
import CardData from './../../data/card/Card';
import EntityData from './../../data/entity/Entity';
import EffectWrapper from './EffectWrapper';
import {PLAYER_ID, STAGE_COL, STAGE_ROW} from './../../state/constant';




export default function Stage(props){

    const dispatch = useDispatch();
    const [isToNextLevel, setToNextLevel] = useState(false);
    
    //state related to previous card usage
    const [cardUsed, setCardUsed ] = useState(null);
    const [cardUser, setCardUser ] = useState(null);

    //NOT IDEAL!! USED FOR REFRESH GIF
    const [refresh, setRefresh] = useState( Math.random()  );


    const rowLen = STAGE_ROW;
    const colLen = STAGE_COL;
    const totalLen = rowLen * colLen;

    const isBattle = useSelector(state => state.game.isBattle);
    const gameMap = useSelector(state => state.map.gameMap );
    const battleMap = useSelector(state => state.map.battleMap );
    const eventInMap = useSelector(state => state.map.eventInMap );
    const playerGameCoord = useSelector(state => state.map.playerGameMapCoord);
    const playerBattleCoord = useSelector( state => state.map.playerBattleMapCoord);
    const entitiesBattleCoords = useSelector( state => state.map.entityInMap);
    const BattleSteps = useSelector(state => state.game.steps);
    const inputLock = useSelector(state => state.game.inputLock );

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
    const statuses = useSelector( state => state.game.statuses );
    const entities = useSelector( state => state.game.entities );
    const playerStatus = statuses[PLAYER_ID];


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
     * get actual coordinate in the whole gamemap based on partial of the gamemap
     * @param {number} column column value presented in "partOf" (presentation layer)
     */
    function getFullCoordFromPart(row, column){
        return { x: column % (colLen) + partIndex, y: row };
    }




    /**
     * Generator, which controls the flow of the entityTurn (End of your turn)
     * @param {Function} callBack function which has ability to call generator.next() on top of callback func
     */
    function* performEntitiesAction(callBack){ 
        /**
         * simple async function that will be yielded (here used as delay between entity who sequence of action)
         * @param {*} action Action that will be dispatched
         * @param {*} callback Callback function, which will be callBack() inside generator
         * @param {*} time in ms
         */
        function delay( action, callback, time ) {
            setTimeout(function () {
              callback(action);
            }, time);
        }


        //Action start here:
        for ( var index = 0; index < entities.length; index++ ){
            const key = entities[index];
            const type = statuses[key].type;
            const distance = EntityData[type].distance;
            const style = EntityData[type].style;
            const cards =EntityData[type].cards ?? [];

            //Move Entity first
            for ( var count = 0; count < distance; count++ ){
                const time = (index === 0 && count === 0 ) ? 0 : 400;
                yield delay(
                    () => { 
                        if (cardUsed !== null ){
                            setCardUsed(null);
                            setCardUser(null);
                        }
                        dispatch(Action.StageAction.moveEntityInBattle(key, style, playerBattleCoord));
                    },
                    callBack, 
                    time
                );
            }
            //Perform cards afterwards
            for (var count = 0; count < cards.length; count++ ){
                const time = (index === 0 && count === 0 ) ? 0 : 400;
                const cardID = cards[count];
                yield delay(
                    () => runCardEffect(cardID, key),
                    callBack, 
                    time
                );
            }
        }
        dispatch(Action.GameStatusAction.iterateTurn())
        dispatch(Action.GameStatusAction.setInputLock(false))
    }
     

    
    /**
     * Helper function for the generator
     * What callback does is to dispatch the action AND called generator.next() to tell generator that
     * it finishes its own job since resumes is called inside delay() as a callback
     * @param {*} generatorFunction 
     */
    function run(generatorFunction) {
        function callBack(func) {
            func();
            generatorItr.next();
        }
        var generatorItr = generatorFunction(callBack);
        generatorItr.next();
    }


    /**
     * Perform Entity Action upon turn gets updated
     * Including: Doing action one by one
     */
    useEffect(() => {
        if ( inputLock === true ){
            run(performEntitiesAction);
        }
    }, [inputLock])

    
    /**
     * Since changing playerDirection re-triggers rendering of battle child
     * causing it to re-play animation in a different direction. Hence, need to setCardUsed Back to null
     */
    useEffect(() => {
        setCardUsed(null);
        setCardUser(null);
    }, [playerStatus.direction]);



    /**
     * Perform Battle checking if it's ready to be ended
     */
    useEffect(() => {    
        //Unmount child entity if target has no health
        Object.keys(statuses).forEach( function(key){
            const status = statuses[key];
            if (  status !== undefined && status !== null && status.health <= 0 && key != PLAYER_ID ){
                dispatch(Action.GameStatusAction.entityDefeated(key));       
            }
        });
        //Reset battlemap back if all entities defeated
        if ( Object.keys(entities).length === 0 ){
            dispatch(Action.GameStatusAction.startBattle(false));
        }
    }, [statuses, entities] );



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
     * Simply use Card Effect
     * NOTE: This is called by both player and entity when using the card effect
     * @see consumeCard
     * @param {*} cardID id of the card
     * @param {*} hostKey id of the host (in redux) using the card
     * @returns {boolean} true if successfully use the card
     * 
     */
    function runCardEffect(cardID, hostKey=PLAYER_ID ){
        const Card = CardData[cardID] ?? {};

        for (var condition in Card.effect ){
            //return false if needed
        }
        //Force Update of the dragged card
        for (var action in Card.effect ){
            dispatch( Card.effect[action](hostKey)  );
        }
        //Force Animation of the card
        setCardUser(hostKey);
        setCardUsed(null);  
        setCardUsed(cardID);
        setRefresh(Math.random());
        return true;  
    }



    /** 
     * use the card in hand, including using its effect and discard it
     * @param {object} item info received upon DND, contain card index in hand and cardID 
    */
    function consumeCard(item){
        const index = item.index;
        const cardID = item.card;
        
        //Use effect
        const usable = runCardEffect(cardID, PLAYER_ID );
        if ( ! usable ) return;

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
     * Move the Player in Map, usable for both map and battle
     * NOTE: this function is passed to the child component as an onClickEvent
     * @param {number} row 
     * @param {number} column 
     */
    function movePlayer(row, column){
        if ( cardUsed !== null ){ setCardUsed(null); setCardUser(null); }
        if ( isBattle ){
            let coord = { x: column, y: row };
            let move = Action.StageAction.movePlayerInBattle(coord);
            dispatch(move);
            dispatch(Action.GameStatusAction.incrementStep(-1));
        }
        else {
            let coord = getFullCoordFromPart(row, column);
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
        let coord = getFullCoordFromPart(row, column);
        dispatch(Action.StageAction.clearEventInMap(coord));
        dispatch(Action.StageAction.movePlayerInMap(coord));
    }



    /**
     * Check if the tile will be used to display animation
     * NOTE: user can be the player or 
     * @param {*} row coordinate of tile
     * @param {*} column coordinate of tile
     * @param {*} cardID ID of the card (default last used card)
     * @param {*} userID ID of the user (default last card user)
     * @returns true if effect going to apply there
     */
    function checkEffect(row, column, cardID = cardUsed , userID = cardUser ){
        if (userID === null || userID === undefined ){ return false; }

        const Card = CardData[cardID] ?? {};
        const target = Card.target ?? [];
        const userCoord = ( userID === PLAYER_ID ) ? currentPlayerCoord : entitiesBattleCoords[userID].Coord;
        const dirMultiplier = ( statuses[userID].direction === Constant.DIRECTION.left  ) ? -1 : 1;

        for (let i = 0; i < target.length; i++ ){
            if ( row === userCoord.y + target[i].y && column === userCoord.x + target[i].x * dirMultiplier  ){
                return true;
            }
        }
        return false;
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


    

    /**
     * Render child in battle map, incomplete
     * @param {number} row 
     * @param {number} column 
     */
    function renderBattleChild(row, column){
        //check which child to render
        let child = null;
        if (currentPlayerCoord.y === row && currentPlayerCoord.x === column ){
            child = <Player key="Player" />;
        }
        else if ( checkEntityCoord(row, column) !== null ){
            const key = checkEntityCoord(row, column);
            const attackable = checkMovable(row, column, 1, false) && BattleSteps > 0 ;
            child = <Entity monsterKey={key} attackable={attackable}/>;
        }
        else if (checkMovable(row, column, 1, false) && BattleSteps > 0 && ! inputLock  ){
            child = (<ClickableCircle click={() => movePlayer(row, column) } />);
        }
        else { child = <div></div>;}


        //check if effect is used in that tile
        const isEffect = ( checkEffect(row, column, cardUsed, cardUser) ) ?  CardData[cardUsed].particle : undefined;
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
                        
                            let index = rowIndex * STAGE_COL + colIndex;
                            let tileStyle = Tile.default[column.toString()].style;  

                            //Detect Attack Tile upon hover
                            if (isBattle){
                                if (isOver && checkEffect(rowIndex, colIndex, item.card, PLAYER_ID) ){
                                    tileStyle = Tile.default[Tile.ATTACK_TILE].style;
                                }
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
            {props.children}
        </div>
    );    
}

