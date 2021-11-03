import React from "react";
import { World } from "physics-worlds";
import styles from "./GameContainer.module.scss";
import KeyReader from "./KeyReader";

import { makeWorld, numberOfLevels } from "../modules/worldFactory";
import { WorldStatus } from "../modules/worldValues";
import MoonLanderGame from "./MoonLanderGame";

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

    handleWorldStatus(status: WorldStatus): void {
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

    togglePaused(): void {
        if (!this.world) { return }
        this.world.ticksPerSecond = this.world.ticksPerSecond ? 0 : SPEED
    }

    reset(): void {

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

    goToNextLevel(): void {
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

                {!!world &&
                    <MoonLanderGame key={world.name}
                        world={world}
                        playerHasDied={playerHasDied}
                        playerHasLanded={playerHasLanded}
                        controls={controls}
                        handleWorldStatus={this.handleWorldStatus}
                        goToNextLevel={this.goToNextLevel}
                        reset={this.reset}
                    />
                }

                <KeyReader
                    report={(controls: { [index: string]: boolean }) => { this.setState({ controls }) }}
                    controlMapping={controlMapping} />

            </main>
        )
    }
}