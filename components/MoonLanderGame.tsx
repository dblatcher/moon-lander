import React from "react";
import { World } from "physics-worlds";
import FullCanvas from "./FullCanvas";
import styles from "./GameContainer.module.scss";
import WorldInterface from "./WorldInterface";

import { getPlayerFuel, getPlayerThrust, WorldStatus, getWorldStatus } from "../modules/worldValues";
import { controlSpaceShip } from "../modules/controlSpaceShip";
import FollowBodyCanvas from "./FollowBodyCanvas";
import BarMeter from "./BarMeter";
import { highlightLandingPad, makeTerrainWhite, spaceShipIsRedCircle } from "../modules/minimap";

export default function MoonLanderGame(props: {
    world: World,
    playerHasLanded: boolean
    playerHasDied: boolean
    controls: { [index: string]: boolean }
    handleWorldStatus: { (worldStatus: WorldStatus): void }
    goToNextLevel: { (): void }
    reset: { (): void }
}) {

    const { world, playerHasLanded, controls, handleWorldStatus, playerHasDied, goToNextLevel, reset } = props

    return <>
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
                <div className={styles.button} onClick={goToNextLevel}>Go to next level!</div>
            </article>
        )}

        {playerHasDied && (
            <article className={styles.dialogue}>
                <p>You have crashed.</p>
                <div className={styles.button} onClick={reset}>Try again....</div>
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