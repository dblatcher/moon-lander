import { World } from "physics-worlds";
import { Song } from "../components/GameContainerTemplate/types";
import { GameMode } from "./GameMode";

export interface WorldStatus {
    playerDead?: boolean
    playerStranded?: boolean
    playerLanded?: boolean
    enemiesGone?: boolean
}

export type KeyMap = { [index: string]: boolean }

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
    soundEffects: {
        [index: string]: string;
    }
    songs?: {
        fail?: Song,
        victory?: Song,
    }
    scoreFetcherUrl: string;
}
