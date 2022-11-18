import { controlMapping } from "./controlSpaceShip";
import { gameModes } from "./gameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from './worldValues';

const asteroidField = {
    gameModes,
    controlMapping,
    statusFunctions: {
        getWorldStatus, 
        isChangeToFailure, 
        isChangeToVictory, 
        playerIsInactive
    }
}

export { asteroidField  }