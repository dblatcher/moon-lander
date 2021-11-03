import React from "react";
import { World } from "physics-worlds";
import FullCanvas from "./FullCanvas";
import styles from "./GameContainer.module.scss";
import KeyReader from "./KeyReader";
import WorldInterface from "./WorldInterface";

import { makeWorld, numberOfLevels } from "../modules/worldFactory";
import { getPlayerFuel, getPlayerThrust, WorldStatus, getWorldStatus } from "../modules/worldValues";
import { controlSpaceShip } from "../modules/controlSpaceShip";
import FollowBodyCanvas from "./FollowBodyCanvas";
import BarMeter from "./BarMeter";
import { highlightLandingPad, makeTerrainWhite, spaceShipIsRedCircle } from "../modules/minimap";

const SPEED = 50;

const controlMapping: { [index: string]: string } = {
    "w": "up",
    "ArrowUp": "up",
    "a": "left",
    "ArrowLeft": "left",
    "d": "right",
    "ArrowRight": "right",
    "s": "down",
    "ArrowDown": "down"
}

export default class GameContainer extends React.Component {
    props!: {
        title: string
    };
    state!: {
        level: number
        controls: { [index: string]: boolean }
        playerHasLanded: boolean
        playerHasDied: boolean
    };
    canvasRef: React.RefObject<HTMLCanvasElement>;
    world?: World

    constructor(props: GameContainer["props"]) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            level: 1,
            controls: {},
            playerHasLanded: false,
            playerHasDied: false,
        }

        this.togglePaused = this.togglePaused.bind(this)
        this.handleWorldStatus = this.handleWorldStatus.bind(this)
        this.goToNextLevel = this.goToNextLevel.bind(this)
        this.reset = this.reset.bind(this)
    }

    componentDidMount() {
        this.reset()
    }

    handleWorldStatus(status: WorldStatus) {
        const { landingPadPlayerIsOn, playerDead } = status;
        const modification: any = {}

        if (!this.state.playerHasDied && playerDead) {
            modification.playerHasDied = true
        }

        if (!this.state.playerHasLanded && landingPadPlayerIsOn) {
            modification.playerHasLanded = true
        }

        this.setState(modification)
    }

    togglePaused() {
        if (!this.world) { return }
        this.world.ticksPerSecond = this.world.ticksPerSecond ? 0 : SPEED
    }

    reset() {

        this.world?.stopTime();

        this.setState({
            playerHasLanded: false,
            playerHasDied: false,
        }, () => {
            const newWorld = makeWorld(this.state.level);
            newWorld.ticksPerSecond = SPEED;
            this.world = newWorld;
            this.forceUpdate();
        })
    }

    goToNextLevel() {
        const nextLevelNumber = this.state.level + 1 > numberOfLevels ? 1 : this.state.level + 1;
        this.setState({
            level: nextLevelNumber
        }, this.reset)
    }

    render() {
        const { title } = this.props;
        const { controls, playerHasLanded, playerHasDied } = this.state;
        const { world } = this;

        return (
            <main className={styles.component} key={world?.name || "no_world"}>

                <h2>{title}</h2>
                <div>
                    <button onClick={this.togglePaused}>pause</button>
                    <button onClick={this.reset}>reset</button>
                    <button onClick={this.goToNextLevel}>skip</button>
                </div>

                {!!world && <>
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

                    <WorldInterface
                        controls={playerHasLanded ? {} : controls}
                        world={world}
                        controlFunction={controlSpaceShip}
                        getWorldStatus={getWorldStatus}
                        reportWorldStatus={this.handleWorldStatus} />

                </>}

                {playerHasLanded && (
                    <article className={styles.dialogue}>
                        <p>You have landed!</p>
                        <div className={styles.button} onClick={this.goToNextLevel}>Go to next level!</div>
                    </article>
                )}

                {playerHasDied && (
                    <article className={styles.dialogue}>
                        <p>You have crashed.</p>
                        <div className={styles.button} onClick={this.reset}>Try again....</div>
                    </article>
                )}

                <KeyReader
                    report={(controls: { [index: string]: boolean }) => { this.setState({ controls }) }}
                    controlMapping={controlMapping} />

            </main>
        )
    }
}