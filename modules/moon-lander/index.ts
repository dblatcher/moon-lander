import { controlMapping } from "./controlSpaceShip";
import { gameModes } from "./gameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from '../../modules/moon-lander/moonLanderWorldValues';
import { GameDefinition } from "../types";

const moonLander: GameDefinition = {
    title: 'Moon Lander',
    gameModes,
    route: 'moon-lander',
    controlMapping,
    statusFunctions: {
        getWorldStatus,
        isChangeToFailure,
        isChangeToVictory,
        playerIsInactive
    }
}

export { moonLander }