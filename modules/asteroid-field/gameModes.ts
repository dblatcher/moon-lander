import * as tutorials from "./level-factory/tutorials";
import * as arcade from "./level-factory/arcade";

import { GameMode } from "../GameMode";


const gameModes: { [index: string]: GameMode } = {
    'normal': new GameMode({
        title: "arcade mode",
        key: "normal",
        noScores: true,
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
        allowSkip: true,
        allowRestart: true,
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
        allowSkip: true,
        allowRestart: true,
        levelFunctions: [
            // tutorials.tutorial1,
            tutorials.tutorial2,
        ]
    }),
}

export { gameModes }