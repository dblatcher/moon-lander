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
        world: World
        worldCreationTimeStamp: number
        controls: { [index: string]: boolean }
        playerHasLanded: boolean
        playerHasDied: boolean
    };
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: GameContainer["props"]) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            level: 1,
            world: makeWorld(),
            worldCreationTimeStamp: Date.now(),
            controls: {},
            playerHasLanded: false,
            playerHasDied: false,
        }

        this.state.world.ticksPerSecond = SPEED
        this.togglePaused = this.togglePaused.bind(this)
        this.handleWorldStatus = this.handleWorldStatus.bind(this)
        this.goToNextLevel = this.goToNextLevel.bind(this)
        this.reset = this.reset.bind(this)
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
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.world.ticksPerSecond = this.state.world.ticksPerSecond ? 0 : SPEED
    }

    reset() {
        this.state.world.stopTime();
        const newWorld = makeWorld(this.state.level);
        newWorld.ticksPerSecond = SPEED;
        this.setState({
            world: newWorld,
            worldCreationTimeStamp: Date.now(),
            playerHasLanded: false,
            playerHasDied: false,
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
        const { controls, world, worldCreationTimeStamp, playerHasLanded, playerHasDied } = this.state;


        return (
            <main className={styles.component}>

                <h2>{title}</h2>
                <div>
                    <button onClick={this.togglePaused}>pause</button>
                    <button onClick={this.reset}>reset</button>
                    <button onClick={this.goToNextLevel}>skip</button>
                </div>

                <div className={styles.mainScreen}>
                    <div>
                        <FollowBodyCanvas
                            key={"A" + worldCreationTimeStamp}
                            world={world}
                            magnify={1}
                            height={1200} width={1200}
                            framefill={'white'}
                        />
                    </div>
                </div>

                <div className={styles.panel}>
                    <FullCanvas key={"B" + worldCreationTimeStamp} world={world} magnify={.2} />
                </div>

                <div className={[styles.panel, styles["panel--left"]].join(" ")}>
                    <div className={styles.row}>
                        <BarMeter world={world} getValues={getPlayerThrust} />
                        <BarMeter meterType="GAGE" world={world} getValues={getPlayerFuel} />
                    </div>
                </div>

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
                    controlMapping={controlMapping}
                />

                <WorldInterface
                    controls={playerHasLanded ? {} : controls}
                    world={world}
                    controlFunction={controlSpaceShip}
                    getWorldStatus={getWorldStatus}
                    reportWorldStatus={this.handleWorldStatus}
                    key={"C" + worldCreationTimeStamp}
                />

            </main>
        )
    }
}