import { GameDefinition } from "../types";
import { controlMapping } from "./controlSpaceShip";
import { gameModes } from "./gameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from './worldValues';

const asteroidField: GameDefinition = {
    title: 'Asteroid Field',
    gameModes,
    route:'asteroid-field',
    controlMapping,
    statusFunctions: {
        getWorldStatus,
        isChangeToFailure,
        isChangeToVictory,
        playerIsInactive
    }
}

export { asteroidField }