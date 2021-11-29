import { makeBlueMoonLevel } from "./blueMoonLevel";
import { makeCavernLevel } from "./cavernLevel";
import { makeCityLevel } from "./cityLevel";
import { makeDaylightCityLevel } from "./dayLightCityLevel";
import { makeMountainsLevel } from "./mountainLevel";


const levelFunctions = [
    makeDaylightCityLevel,
    makeMountainsLevel,
    makeCityLevel,
    makeBlueMoonLevel,
    makeCavernLevel,
]


const numberOfLevels = levelFunctions.length

function makeWorld(levelNumber = 1) {
    if (levelNumber > numberOfLevels || levelNumber < 1) {
        levelNumber = 1;
    }
    const world = levelFunctions[levelNumber - 1]();
    world.name = "WORLD_" + Date.now().toString();
    console.log("created:", world.name)
    return world
}

const tutorialLevelFunctions = [
    makeCityLevel,
]

const numberOfTutorialLevels = tutorialLevelFunctions.length

function makeTutorialWorld(levelNumber = 1) {
    if (levelNumber > numberOfTutorialLevels || levelNumber < 1) {
        levelNumber = 1;
    }
    const world = tutorialLevelFunctions[levelNumber - 1]();
    world.name = "WORLD_" + Date.now().toString();
    console.log("created:", world.name)
    return world
}

// to do - define these within the gameModes

export {
    makeWorld, numberOfLevels,
    makeTutorialWorld, numberOfTutorialLevels
}