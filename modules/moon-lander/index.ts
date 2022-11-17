import { controlMapping } from "./controlSpaceShip";
import { gameModes } from "./gameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from '../../modules/moon-lander/moonLanderWorldValues';

const moonLander = {
    gameModes,
    controlMapping,
    statusFunctions: {
        getWorldStatus, 
        isChangeToFailure, 
        isChangeToVictory, 
        playerIsInactive
    }
}

export { moonLander }