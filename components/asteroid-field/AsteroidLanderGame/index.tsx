import React from "react";
import { World } from "physics-worlds";

import FullCanvas from "../../FullCanvas";
import WorldInterface from "../../WorldInterface";
import FollowBodyCanvas from "../../FollowBodyCanvas";
import NumberPanel from "../../NumberPanel";
import Dialogue from "../../Dialogue";
import PausedSymbol from "../../PausedSymbol";

import { GameContainerState } from "../../GameContainerTemplate/types";
import { controlSpaceShip } from "../../../modules/asteroid-field/controlSpaceShip";
import { GameMode } from "../../../modules/GameMode";
import { getWorldStatus, getPlayerSpaceship, getPlayerThrust } from "../../../modules/asteroid-field/worldValues";
import { KeyMap, WorldStatus } from "../../../modules/types";
import { highlightLandingPad, spaceShipIsRedCircle, noAreas, highlightRefuelPad, makeRocksBlack } from "../../../modules/minimap";

import styles from "./styles.module.scss";
import dialogueStyles from "../../Dialogue/styles.module.scss";
import Indicator from "../../Indicator";


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function AsteroidGame(props: Readonly<{
    world: World
    gameMode: GameMode
    worldStatus: WorldStatus
    score: number
    lives: number
    level: number
    mode: "TITLE" | "PLAY" | "HIGHSCORE" | "INTRO"
    isPaused: boolean
    controls: KeyMap
    handleWorldStatus: { (worldStatus: WorldStatus): void }
    addPoints: { (points: number): Promise<GameContainerState> }
    addLives: { (points: number): Promise<GameContainerState> }
    startLevel: { (level?: number): Promise<GameContainerState> }
    endPlaySession: { (): Promise<GameContainerState> }
}>) {

    const {
        world, worldStatus, level, score, lives, controls, isPaused, mode, gameMode,
        handleWorldStatus, startLevel, addPoints, addLives, endPlaySession
    } = props

    const onLastLevel = (level + 1 > gameMode.numberOfLevels);

    async function advance() {
        const points = onLastLevel ? 100 : 50;

        await addPoints(points)
        await sleep(250);

        if (onLastLevel) {
            await endPlaySession()
        } else {
            await startLevel(level + 1)
        }
    }

    async function retry() {
        await addLives(-1);
        await startLevel();
    }

    return <article className={styles.article}>

        <section className={styles.screensRow}>
            <div className={styles.mainScreen}>
                <div>
                    <FollowBodyCanvas
                        world={world}
                        getSubject={getPlayerSpaceship}
                        magnify={1}
                        height={1200} width={1200}
                        framefill={'gray'} />
                </div>
            </div>
            <div className={styles.scannerScreen}>
                <FullCanvas
                    world={world}
                    dontRenderBackground
                    backGroundOverride={'transparent'}
                    dontRenderEffects
                    transformRules={[
                        makeRocksBlack,
                        spaceShipIsRedCircle,
                        highlightLandingPad,
                        noAreas,
                        highlightRefuelPad,
                    ]}
                    magnify={.2} />
            </div>
        </section>

        <section className={styles.panelRow}>
            <NumberPanel gameMode={gameMode}
                score={score}
                level={level}
                lives={lives} />

            <Indicator
                caption="THRUST"
                world={world}
                getValues={getPlayerThrust} />

        </section>

        {(worldStatus.enemiesGone && mode === "PLAY") && (
            <Dialogue placement="TOP" design="YELLOW">
                <p>All rocks are gone</p>
                {onLastLevel && <p> Congratulations! That was the last level!</p>}

                <button className={dialogueStyles.button} onClick={advance}>
                    {onLastLevel ? 'Finished...' : 'Go to next level!'}
                </button>
            </Dialogue>
        )}

        {(worldStatus.playerDead && mode === "PLAY") && (
            <Dialogue placement="TOP" design="YELLOW">
                <p>You have crashed.</p>

                {lives > 0 ? (
                    <button className={dialogueStyles.button} onClick={retry}>Try again....</button>
                ) : (
                    <button className={dialogueStyles.button} onClick={() => { endPlaySession() }}>Game Over!</button>
                )}
            </Dialogue>
        )}

        {(worldStatus.playerStranded && !worldStatus.playerLanded && mode === "PLAY") && (
            <Dialogue placement="TOP" design="YELLOW">
                <p>Somehow stranded?</p>

                {lives > 0 ? (
                    <button className={dialogueStyles.button} onClick={retry}>Try again....</button>
                ) : (
                    <button className={dialogueStyles.button} onClick={() => { endPlaySession() }}>Game Over!</button>
                )}
            </Dialogue>
        )}

        {(isPaused && mode === "PLAY") && (
            <PausedSymbol />
        )}

        <WorldInterface
            controls={(!worldStatus.playerLanded && mode === "PLAY") ? controls : {}}
            world={world}
            allKeyControlFunction={controlSpaceShip}
            getWorldStatus={getWorldStatus}
            reportWorldStatus={handleWorldStatus}
            addPoints={addPoints}
        />

    </article>
}