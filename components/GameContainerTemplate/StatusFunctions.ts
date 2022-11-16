import { World } from "physics-worlds";

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
