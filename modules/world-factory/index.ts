import { makeBlueMoonLevel } from "./blueMoonLevel";
import { makeMountainsLevel } from "./mountainLevel";


const levelFunctions = [
    makeMountainsLevel,
    makeBlueMoonLevel,
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

export {
    makeWorld, numberOfLevels
}