import * as tutorials from "./level-factory/tutorials";
import * as arcade from "./level-factory/arcade";
import * as classics from "./level-factory/classic";

import { GameMode } from "./GameMode";


const gameModes: { [index: string]: GameMode } = {
    'normal': new GameMode({
        title: "arcade mode",
        key: "normal",
        levelFunctions: [
            arcade.makeDaylightCityLevel,
            arcade.makeMountainsLevel,
            arcade.makeCityLevel,
            arcade.makeBlueMoonLevel,
            arcade.makeCavernLevel,
        ]
    }),
    'trainer': new GameMode({
        title: "arcade mode(trainer)",
        key: "trainer",
        startingLives: Infinity,
        noScores: true,
        hidden: true,
        allowSkip:true,
        allowRestart:true,
        levelFunctions: [
            arcade.makeDaylightCityLevel,
            arcade.makeMountainsLevel,
            arcade.makeCityLevel,
            arcade.makeBlueMoonLevel,
            arcade.makeCavernLevel,
        ]
    }),
    'tutorial': new GameMode({
        title: "tutorial",
        key: "tutorial",
        startingLives: Infinity,
        speed: 40,
        noScores: true,
        allowSkip:true,
        allowRestart:true,
        levelFunctions: [
            tutorials.tutorial1,
            tutorials.tutorial2,
            tutorials.tutorial3,
            tutorials.tutorial4,
        ]
    }),

    'classic': new GameMode({
        title:"Classic levels",
        key:"classic",
        hidden:true,
        noScores: true,
        allowRestart:true,
        allowSkip:true,
        startingLives: 3,
        levelFunctions: [
            classics.breezio,
            classics.moonbaseAlpha,
            classics.grandCanyon,
            classics.planetFall,
        ]
    })
}

export { gameModes }