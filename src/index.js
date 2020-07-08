import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import store from './state/store';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import {BrowserRouter as Router} from 'react-router-dom';
//import * as serviceWorker from './serviceWorker';

import titlePic from './asset/TitlePic.png';

import CardData from './data/card/Card';
import EntityData from './data/entity/Entity';
import EventData from './data/event/Event';


/** Preload all images! */
const allImages = [titlePic];
const Preload = require("react-preload").Preload;

/*
Object.keys(EntityData).map((key, index) => {
    const entity = EntityData[key];
    const image= require("./asset/entity/" + entity.image);
    allImages.push(image);
});
Object.keys(CardData).map((key, index) => {
    const card = CardData[key];
    const particle= require("./asset/particles/" + card.particle);
    allImages.push(particle);
});
Object.keys(EventData).map((key, index) => {
    const event = EventData[key];
    if (event.image !== undefined && event.image !== ""){
        const image = require("./asset/event/" + event.image);
        allImages.push(image);
    }
});
*/


console.log(`A total of ${allImages.length} images are preloaded`);

ReactDOM.render((
    <Provider store = {store} >
        <Router>
            <DndProvider options={HTML5toTouch}> 
                <Preload
                images={allImages}
                loadingIndicator = {<p>Loading</p>}
                resolveOnError={true}
                mountChildren={true}
                >
                    <App />
                </Preload>
            </DndProvider>
        </Router>
    </Provider>
    ), 
document.getElementById('root'));



/* Progressive WebApp Only */
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

