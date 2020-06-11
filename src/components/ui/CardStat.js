
import React from 'react'
import {useSelector} from 'react-redux';
import Style from "./../../css/Style.module.css";

export default function CardStat() {
    const isBattle = useSelector(state => state.game.isBattle)
    const deckList = useSelector(state => state.card.deckList)
    const pileList = useSelector(state => state.card.pileList)

    console.log(pileList);

    if (! isBattle) return <div></div>;

    return (
        <div class={Style.cardStat} >
            DECK: {deckList.length} {' '} DISCARD: {pileList.length}
        </div>
    )
}
