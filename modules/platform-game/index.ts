import { GameDefinition } from "../types";
import { controlMapping } from "./controlRobot";
import { plaformGameModes } from "./platformGameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from './platformGameWorldValues';

const platformGame: GameDefinition = {
    title: "Roving' Robot",
    gameModes: plaformGameModes,
    route: 'platform',
    controlMapping,
    statusFunctions: {
        getWorldStatus,
        isChangeToFailure,
        isChangeToVictory,
        playerIsInactive
    }
}

export { platformGame }