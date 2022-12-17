import * as tutorials from "./level-factory/tutorials";
import * as arcade from "./level-factory/arcade";
import * as classics from "./level-factory/classic";

import { GameMode } from "../GameMode";

const mainLevels = [
    classics.breezio,
    arcade.makeDaylightCityLevel,
    arcade.makeMountainsLevel,
    classics.moonbaseAlpha,
    arcade.makeCityLevel,
    classics.planetFall,
    arcade.makeBlueMoonLevel,
    classics.grandCanyon,
    arcade.makeCavernLevel,
]

const gameModes: { [index: string]: GameMode } = {
    'normal': new GameMode({
        title: "arcade",
        key: "normal",
        levelFunctions: mainLevels
    }),
    'trainer': new GameMode({
        title: "arcade(trainer)",
        key: "trainer",
        startingLives: Infinity,
        noScores: true,
        hidden: true,
        allowSkip: true,
        allowRestart: true,
        levelFunctions: mainLevels
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
            tutorials.tutorial1,
            tutorials.tutorial2,
            tutorials.tutorial3,
            tutorials.tutorial4,
        ]
    }),
}

export { gameModes }