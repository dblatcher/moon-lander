import { World } from "physics-worlds";
import { makeTutorialWorld, makeWorld, numberOfLevels, numberOfTutorialLevels } from "./world-factory";

interface GameMode {
    title: string
    key: string
    numberOfLevels: number
    makeWorld: { (level?: number): World }
}

const gameModes: { [index: string]: GameMode } = {
    'normal': {
        title: "arcade mode",
        key: "normal",
        numberOfLevels:numberOfLevels,
        makeWorld: makeWorld,
    },
    'tutorial': {
        title: "tutorial",
        key: "tutorial",
        numberOfLevels:numberOfTutorialLevels,
        makeWorld: makeTutorialWorld,
    },
}

export type { GameMode }
export { gameModes }