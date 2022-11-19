import { World } from "physics-worlds";
import { GameMode } from "./GameMode";

export interface WorldStatus {
    playerDead?: boolean
    playerStranded?: boolean
    playerLanded?: boolean
}

export type StatusFunctions = {
    getWorldStatus: { (world: World): WorldStatus };
    isChangeToFailure: { (oldStatus: WorldStatus, newStatus: WorldStatus): boolean };
    isChangeToVictory: { (oldStatus: WorldStatus, newStatus: WorldStatus): boolean };
    playerIsInactive: { (status: WorldStatus): boolean };
}

export type GameDefinition = {
    title: string;
    route: string;
    gameModes: Record<string, GameMode>;
    controlMapping: {
        [index: string]: string;
    };
    statusFunctions: {
        getWorldStatus: (world: World) => WorldStatus;
        isChangeToFailure: (oldStatus: WorldStatus, newStatus: WorldStatus) => boolean;
        isChangeToVictory: (oldStatus: WorldStatus, newStatus: WorldStatus) => boolean;
        playerIsInactive: (status: WorldStatus) => boolean;
    };
    scoreFetcherUrl: string;
}
