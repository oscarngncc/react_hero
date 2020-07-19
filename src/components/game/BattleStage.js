
import React, {useState, useRef, useEffect} from 'react';
import { useSpring, useTrail, animated, useChain } from 'react-spring';
import {useSelector, useDispatch} from 'react-redux';
import { useDrop } from 'react-dnd';

import FlipMove from 'react-flip-move';

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
import useMovable from '../../hook/useMovable';




export default function BattleStage(props){
    const dispatch = useDispatch();
    
    //state related to previous card usage
    const [hasParticle, sethasParticle] = useState(false);
    const [refresh, setRefresh] = useState( Math.random()  ); //NOT IDEAL!! USED FOR REFRESH GIF

    const rowLen = STAGE_ROW;
    const colLen = STAGE_COL;

    const battleMap = useSelector(state => state.map.battleMap );
    const particleInMap = useSelector(state => state.map.particleInMap);

    const playerBattleCoord = useSelector( state => state.map.playerBattleMapCoord);
    const entitiesBattleCoords = useSelector( state => state.map.entityInMap);
    const BattleSteps = useSelector(state => state.game.steps);
    const inputLock = useSelector(state => state.game.inputLock );


    //Placeholder, shouldn't be in use
    const defaultMap = new Array(rowLen).fill(0).map(() => new Array(colLen).fill(0) );

    //entity Statuses
    const statuses = useSelector( state => state.game.statuses );
    const entities = useSelector( state => state.game.entities );

    //This should be the only ones used by the presentation layer 
    const [currentMap, setcurrentMap] = useState( JSON.parse(JSON.stringify(battleMap ?? defaultMap))   );
    const currentPlayerCoord = playerBattleCoord ?? {x: 0, y: 0};

    const movable = useMovable(currentMap, currentPlayerCoord, 1, false );
    

    /**
     * DND-Droppable
     * drop: only care about return undefined or not
     */
    const [{ item, isOver}, drop] = useDrop({
        accept: 'Card',
        drop: () => { consumeCard(item); return item; },  
        collect: (monitor) => ({
            item: monitor.getItem(),
            isOver: monitor.isOver(),
        })
    });


    /**
     * Reset Particle Map once used
     */
    useEffect(() => {
        if (hasParticle){
            setTimeout(() => { sethasParticle(false) }, 500);
        }
    }, [hasParticle]);

    /**
     * Perform Battle checking if it's ready to be ended
     * TODO: Business LOGIC
     */
    useEffect(() => {    
        //Unmount child entity if target has no health
        Object.keys(statuses).forEach( function(key){
            const status = statuses[key] ?? undefined;
            if ( status != undefined && status.health <= 0 && key != PLAYER_ID ){
                dispatch(Action.GameStatusAction.entityDefeated(key));       
            }
        });
        //Reset battlemap back if all entities defeated
        if ( Object.keys(entities).length === 0 ){
            dispatch(Action.GameStatusAction.startBattle(false));
        }
    }, [statuses, entities] );
    
    /**
     * Perform Entity Action upon turn gets updated
     * Including: Doing action one by one
     */
    useEffect(() => {
        if (inputLock === true){
            dispatch( Action.GameStatusAction.runEntitiesAction( runCardEffect ) );
        }
    }, [inputLock]);    

    /**
     * Check if Drag,
     * Smartly use setParticleWithCard to determine the potential affected position
     */
    useEffect(() => {
        if (isOver){
            const cardID = CardData[item.card].key;
            dispatch( Action.StageAction.setParticleWithCard(cardID, PLAYER_ID) )
        }
    }, [isOver])

    

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
        dispatch( Action.StageAction.setParticleWithCard(cardID, hostKey) )
        setRefresh(Math.random());
        sethasParticle(true);   
        dispatch(Action.CardAction.runCardEffect(cardID, hostKey) )
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
     * Move the Player in Battle Map
     * NOTE: this function is passed to the child component as an onClickEvent
     * @param {number} row 
     * @param {number} column 
     */
    function movePlayer(row, column){
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
            const attackable = movable[row][column] && BattleSteps > 0 ;
            child = <Entity monsterKey={key} attackable={attackable}/>;
        }
        else if ( movable[row][column] && BattleSteps > 0 && ! inputLock && ! isOver  ){
            child = (<ClickableCircle click={() => movePlayer(row, column) } />);
        } 
        //check if effect is used in that tile
        const isEffect = (hasParticle) ? particleInMap[row][column] : null ;
        return <EffectWrapper effect={isEffect} refresh={refresh} >{child} </EffectWrapper>;
    }
    

    //USED FOR FLIP - Debug
    const flatEntitiesMap = [];
    for ( var i = -1; i >= rowLen * colLen * -1; i-- ){ flatEntitiesMap.push(i); }
    flatEntitiesMap[currentPlayerCoord.y * colLen + currentPlayerCoord.x] = PLAYER_ID;
    Object.keys(entitiesBattleCoords).map( (key, index) => {
        flatEntitiesMap[entitiesBattleCoords[key].Coord.y * colLen + entitiesBattleCoords[key].Coord.x] = key;
    });
    

    const dragMapStyle = (isOver) ? { boxShadow: "0 40px 100px -10px rgba(245, 245, 245, 0.35), 0 40px 40px -10px rgba(245, 245, 245, 0.3)"} : {};
    return (
        <div class={Style.stage} ref={drop} >
            <animated.div class={Style.gameMap} style={ {...dragMapStyle }  } > 
                <ul>     
                    {currentMap.map((row, rowIndex) => {
                        return row.map((column, colIndex) => {
                            const index = rowIndex * STAGE_COL + colIndex;
                            const tileStyle = (particleInMap[rowIndex][colIndex] !== null && isOver) ? 
                                Tile.attackTile.style : Tile.default[column.toString()].style; 
                            return (
                                <animated.li 
                                class={Style.floorUnit}
                                key={"tile" + index.toString()} 
                                style={{...tileStyle}}
                                >
                                </animated.li>                           
                            );
                        })
                    })}
                </ul>

                <ul style={{position: "absolute", top: "0" }} > 
                    <FlipMove duration={300} leaveAnimation="none"  > 
                        { ( flatEntitiesMap.map((item, index) => {   
                            return (
                                <li class={Style.floorUnit} key={item} >
                                    { renderBattleChild( Math.floor(index/colLen), index % colLen ) }
                                </li>                                               
                            );         
                        }))}
                    </FlipMove>   
                </ul>             
            </animated.div>
            {props.children}
        </div>
    );    
}


//renderBattleChild( Math.floor(index/colLen), index % colLen )




