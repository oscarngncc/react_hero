

import React, {useState, useRef} from 'react'

import Style from './../../css/Style.module.css';
import  * as Action from '../../state/action/action';
import { useDispatch } from 'react-redux';
import { useSpring, useChain, animated, interpolate } from 'react-spring';
import headerImage from './../../asset/TitlePic.png';
import GitHubMark from './../../asset/ui/GitHub-Mark-32px.png';
import Library from './Library';
import {Link} from 'react-router-dom';


export default function Menu(props) {
    const dispatch = useDispatch();
    const [aboutStart, setaboutStart] = useState(false);
    const [isSide, setisSide] = useState(false);

    const fadeSpring = useSpring({
        from: { opacity: 1,},
        to: {
            opacity: (aboutStart) ? 0 : 1,
            transform: (aboutStart) ? "translateY(-3rem)" : "translateY(0rem)" 
        },
        config:  { mass: 4, tension: 600, friction: 200 },
        onRest: () => {startGame()},
    });

    
    //Side Spring
    const defaultSideStyle = {
        height: "90vh",
        borderRadius: "0%",
        o: 1,
    };
    const sideMenuRef = useRef();
    const sideSpring = useSpring({
        from: defaultSideStyle,
        to:  (isSide) ? 
        [{
            height: "5rem",
            borderRadius: "2%",
            o: 0,
        },] 
        : defaultSideStyle,
        ref: sideMenuRef,
        config:  { mass: 4, tension: 1000, friction: 120 },
    });
    const libraryInRef = useRef();
    const libraryInSpring = useSpring({
        from: {
            opacity: 0, 
            transform: "translateY(3rem)",
        },
        to: {
            opacity: (isSide) ? 1 : 0,
            transform: (isSide) ? "translateY(0rem)" : "translateY(3rem)",
        },
        ref: libraryInRef,
        config: { mass: 4, tension: 1000, friction: 120 },
    });
    useChain([sideMenuRef, libraryInRef] );


    const neonSpring = useSpring({
       from: {opacity: 1},
       to: async next => {
           while(true){
                await next({opacity: 0.4});
                await next({opacity: 1});
                await new Promise(resolve => setTimeout(resolve, 8000));
           }
       },
       delay: 2000,
       config: {mass: 1, tension: 500, friction: 12}
    })


    
    function onClickStart(){
        if (!aboutStart) setaboutStart(true);
    }


    function startGame(){
        if (aboutStart){
            dispatch(Action.GameStatusAction.startGame(true));
        }
    }

    
    const sideStyle = isSide ? sideSpring : {};
    const library = (isSide) ? <animated.div style={libraryInSpring}>
        <Library></Library>
    </animated.div> : <div></div>;
    

    return (
        <animated.div style={{...fadeSpring }}  >
            <div>
                <animated.div class={Style.mainMenu } style={{...sideStyle}} >
                    
                    <animated.div style={{opacity: libraryInSpring.opacity.interpolate(o => o) }} >
                        <Link to="/" onClick={() => { setisSide(false);}} >
                            {(isSide) ? "Back" : "" }
                        </Link>
                    </animated.div>

                    
                    <animated.div style={{ opacity: sideSpring.o.interpolate(o => o) }} >
                        <img src={headerImage} class={Style.headerImage} />
                        <ul>
                            <li onClick={() => onClickStart()} style={{margin:"1.2rem"}} >
                                <Link to="/game" class={Style.mainMenuItem}>
                                    Play
                                </Link>
                            </li>
                            <li onClick={() => { setisSide(true);}} style={{margin:"1.2rem"}} >
                                <Link to="/library" class={Style.mainMenuItem}>
                                    Library
                                </Link>
                            </li>
                            <li style={{margin:"1.2rem"}} >
                            <Link to="/setting" class={Style.mainMenuItem}  >
                                    Setting
                                </Link>
                            </li>
                        </ul>
                        <animated.div style={{
                            opacity: sideSpring.o.interpolate(o => `${o}`),
                        }} > 
                            <animated.div style={neonSpring} >Design and Developed by: 
                                <br/>Innonion_ncc
                            </animated.div>
                            <a href ="https://github.com/oscarngncc/react_hero">
                                <img style={{margin:"0.8rem"}} src={GitHubMark}/>
                            </a>
                        </animated.div>
                    </animated.div>
            
                </animated.div>          
                {library}
            </div>
        </animated.div>
    );
}
