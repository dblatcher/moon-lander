import React from "react";
import { World } from "physics-worlds";

import FullCanvas from "./FullCanvas";
import WorldInterface from "./WorldInterface";
import FollowBodyCanvas from "./FollowBodyCanvas";
import BarMeter from "./BarMeter";

import { controlSpaceShip } from "../modules/controlSpaceShip";
import { getPlayerFuel, getPlayerThrust, WorldStatus, getWorldStatus } from "../modules/worldValues";
import { highlightLandingPad, makeTerrainWhite, spaceShipIsRedCircle } from "../modules/minimap";

import styles from "./MoonLanderGame.module.scss";

import { GameContainerState } from "./GameContainer";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function MoonLanderGame(props: {
    world: World,
    playerHasLanded: boolean
    playerHasDied: boolean
    score: number
    lives: number
    level: number
    isPaused: boolean
    controls: { [index: string]: boolean }
    handleWorldStatus: { (worldStatus: WorldStatus): void }
    addPoints: { (points: number): Promise<GameContainerState> }
    addLives: { (points: number): Promise<GameContainerState> }
    startLevel: { (level?: number): Promise<GameContainerState> }
    goToTitles: { (level?: number): Promise<GameContainerState> }
}) {

    const {
        world, playerHasLanded, level, score, lives, controls, playerHasDied, isPaused,
        handleWorldStatus, startLevel, addPoints, addLives, goToTitles
    } = props


    async function advance() {
        await addPoints(100)
        await sleep(1000);
        await startLevel(level + 1)
    }

    async function retry() {
        await addLives(-1);
        await startLevel();
    }

    return <>
        <p className={styles.numberPanel}>
            <span>level: {level}</span>
            <span>score: {score}</span>
            <span>lives: {lives}</span>
        </p>
        <div className={styles.mainScreen}>
            <div>
                <FollowBodyCanvas
                    world={world}
                    magnify={1}
                    height={1200} width={1200}
                    framefill={'white'} />
            </div>
        </div>

        <div className={[styles.panel, styles["panel--metal"]].join(" ")}>
            <FullCanvas
                world={world}
                dontRenderBackground={true}
                transformRules={[
                    makeTerrainWhite,
                    spaceShipIsRedCircle,
                    highlightLandingPad,
                ]}
                magnify={.2} />
        </div>

        <div className={[styles.panel, styles["panel--left"], styles["panel--metal"]].join(" ")}>
            <div className={styles.row}>
                <BarMeter
                    world={world}
                    getValues={getPlayerThrust} />
                <BarMeter
                    meterType="GAGE"
                    world={world}
                    getValues={getPlayerFuel} />
            </div>
        </div>

        {playerHasLanded && (
            <article className={styles.dialogue}>
                <p>You have landed!</p>
                <button className={styles.button} onClick={advance}>Go to next level!</button>
            </article>
        )}

        {playerHasDied && (
            <article className={styles.dialogue}>
                <p>You have crashed.</p>

                {lives > 0 ? (
                    <button className={styles.button} onClick={retry}>Try again....</button>
                ) : (
                    <button className={styles.button} onClick={() => { goToTitles() }}>Game Over!</button>

                )}
            </article>
        )}

        {isPaused && (
            <article className={styles.dialogue}>
                <p>PAUSED</p>
            </article>
        )}

        <WorldInterface
            controls={playerHasLanded ? {} : controls}
            world={world}
            controlFunction={controlSpaceShip}
            getWorldStatus={getWorldStatus}
            reportWorldStatus={handleWorldStatus} />

    </>
}