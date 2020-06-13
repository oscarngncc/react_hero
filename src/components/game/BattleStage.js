
import React, {useState, useRef, useEffect} from 'react';
import { useSpring, useTrail, animated, useChain } from 'react-spring';
import {useSelector, useDispatch} from 'react-redux';
import { useDrop } from 'react-dnd';

import Style from './../../css/Style.module.css';
import * as Action from '../../state/action/action';
import * as Tile from '../../data/tile/Tile';
import ClickableCircle from '../ui/ClickableCircle';
import Player from './Player';
import Entity from './Entity';
import * as Constant from '../../state/constant';
import CardData from '../../data/card/Card';
import EntityData from '../../data/entity/Entity';
import EffectWrapper from './EffectWrapper';
import {PLAYER_ID, STAGE_COL, STAGE_ROW} from '../../state/constant';




export default function BattleStage(props){
    const dispatch = useDispatch();
    
    //state related to previous card usage
    const [cardUsed, setCardUsed ] = useState(null);
    const [cardUser, setCardUser ] = useState(null);
    const [refresh, setRefresh] = useState( Math.random()  ); //NOT IDEAL!! USED FOR REFRESH GIF

    const rowLen = STAGE_ROW;
    const colLen = STAGE_COL;
    const totalLen = rowLen * colLen;

    const battleMap = useSelector(state => state.map.battleMap );
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


    //entity Statuses
    const statuses = useSelector( state => state.game.statuses );
    const entities = useSelector( state => state.game.entities );
    const playerStatus = statuses[PLAYER_ID];


    //This should be the only ones used by the presentation layer 
    const currentMap = battleMap ?? defaultMap; 
    const currentPlayerCoord = playerBattleCoord ?? {x: 0, y: 0};


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
        const usable = runCardEffect(cardID, PLAYER_ID );
        if ( usable ){ dispatch(Action.CardAction.discardCard(index) ); }
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
        let result = Object.keys(entitiesBattleCoords).filter( key => entitiesBattleCoords[key]["Coord"].y === row && entitiesBattleCoords[key]["Coord"].x === column  );
        return (result[0] ?? null);
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
        if (userID !== PLAYER_ID && entitiesBattleCoords[userID] === undefined ){ return false; }

        const Card = CardData[cardID] ?? {};
        const target = Card.target ?? [];
        const userCoord = ( userID === PLAYER_ID ) ? currentPlayerCoord : entitiesBattleCoords[userID].Coord;
        const userStatus = statuses[userID] ?? {};
        const dirMultiplier = ( userStatus.direction === Constant.DIRECTION.left  ) ? -1 : 1;

        for (let i = 0; i < target.length; i++ ){
            if ( row === userCoord.y + target[i].y && column === userCoord.x + target[i].x * dirMultiplier  ){
                return true;
            }
        }
        return false;
    }


    /**
     * Move the Player in Battle Map
     * NOTE: this function is passed to the child component as an onClickEvent
     * @param {number} row 
     * @param {number} column 
     */
    function movePlayer(row, column){
        if ( cardUsed !== null ){ setCardUsed(null); setCardUser(null); }
        let coord = { x: column, y: row };
        let move = Action.StageAction.movePlayerInBattle(coord);
        dispatch(move);
        dispatch(Action.GameStatusAction.incrementStep(-1));
    }


    /**
     * Render child in battle map, incomplete
     * @param {number} row 
     * @param {number} column 
     */
    function renderBattleChild(row, column){
        let child = <div></div>;
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

        //check if effect is used in that tile
        const isEffect = ( checkEffect(row, column, cardUsed, cardUser) ) ?  CardData[cardUsed].particle : undefined;
        return <EffectWrapper effect={isEffect} refresh={refresh} >{child} </EffectWrapper>;
    }


    const dragMapStyle = (isOver) ? { boxShadow: "0 40px 100px -10px rgba(245, 245, 245, 0.35), 0 40px 40px -10px rgba(245, 245, 245, 0.3)"} : {};
    return (
        <div class={Style.stage} ref={drop} >
            <animated.div class={Style.gameMap} style={ {...dragMapStyle }  } >
                <ul class={Style.tileMap}>
                    {currentMap.map((row, rowIndex) => {
                        return row.map((column, colIndex) => {
                        
                            let index = rowIndex * STAGE_COL + colIndex;
                            let tileStyle = Tile.default[column.toString()].style; 

                            //Check hover
                            if (isOver && checkEffect(rowIndex, colIndex, item.card, PLAYER_ID) ){
                                tileStyle = Tile.default[Tile.ATTACK_TILE].style;
                            }
                            return (
                                <animated.li 
                                class={Style.floorUnit}
                                key={"tile" + index.toString()} 
                                style={{...tileStyle}}
                                >
                                    {renderBattleChild(rowIndex, colIndex)}
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

