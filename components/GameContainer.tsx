import React from "react";
import { World } from "physics-worlds";
import styles from "./GameContainer.module.scss";
import KeyReader from "./KeyReader";

import { makeWorld, numberOfLevels } from "../modules/worldFactory";
import { WorldStatus } from "../modules/worldValues";
import MoonLanderGame from "./MoonLanderGame";
import MoonLanderTitleScreen from "./MoonLanderTitleScreen";

const SPEED = 50;

const STARTING_LIVES = 2;

const controlMapping: { [index: string]: string } = {
    "w": "up",
    "ArrowUp": "up",
    "a": "left",
    "ArrowLeft": "left",
    "d": "right",
    "ArrowRight": "right",
    "s": "down",
    "ArrowDown": "down",
    " ": "START",
    "p": "PAUSE",
    "P": "PAUSE",
}

export default class GameContainer extends React.Component {
    props!: {
        title: string
    };
    state!: {
        level: number
        score: number
        lives: number,
        controls: { [index: string]: boolean }
        playerHasLanded: boolean
        playerHasDied: boolean
        mode: "TITLE" | "PLAY"
    };
    canvasRef: React.RefObject<HTMLCanvasElement>;
    world?: World

    constructor(props: GameContainer["props"]) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            level: 1,
            score: 0,
            lives: STARTING_LIVES,
            controls: {},
            playerHasLanded: false,
            playerHasDied: false,
            mode: "TITLE",
        }

        this.togglePaused = this.togglePaused.bind(this)
        this.handleWorldStatus = this.handleWorldStatus.bind(this)
        this.goToNextLevel = this.goToNextLevel.bind(this)
        this.addPoints = this.addPoints.bind(this)
        this.resetLevel = this.resetLevel.bind(this)
        this.handleCommandPress = this.handleCommandPress.bind(this)
    }

    handleCommandPress(command: string) {
        const { mode, playerHasDied, playerHasLanded } = this.state;


        switch (command) {
            case "START":
                if (mode !== "TITLE") { return }

                this.setState({
                    mode: "PLAY",
                    level: 1,
                    lives: STARTING_LIVES,
                    score: 0,
                }, () => {
                    this.resetLevel();
                })
                break;

            case "PAUSE":
                if (mode !== "PLAY" || playerHasDied || playerHasLanded) { return }
                this.togglePaused();
                break;
        }

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

    get isPaused(): boolean {
        return this.world ? this.world.ticksPerSecond === 0 : false;
    }

    resetLevel(): Promise<void> {
        return new Promise(resolve => {
            this.world?.stopTime();
            const newWorld = makeWorld(this.state.level);
            newWorld.ticksPerSecond = SPEED;
            this.world = newWorld;
    
            this.setState({
                playerHasLanded: false,
                playerHasDied: false,
            }, () => {
                resolve()
            })
        })
    }

    goToNextLevel(): void {
        const nextLevelNumber = this.state.level + 1 > numberOfLevels ? 1 : this.state.level + 1;
        this.setState({
            level: nextLevelNumber
        }, this.resetLevel)
    }

    addPoints(amount: number): void {
        this.setState({ score: this.state.score + amount })
    }

    render() {
        const { title } = this.props;
        const { controls, playerHasLanded, playerHasDied, score, mode } = this.state;
        const { world } = this;

        return (
            <main className={styles.component} key={world?.name || "no_world"}>

                <h2>{title}</h2>
                <div>
                    <button onClick={this.togglePaused}>pause</button>
                    <button onClick={this.resetLevel}>resetLevel</button>
                    <button onClick={this.goToNextLevel}>skip</button>
                </div>


                {(mode === "TITLE") &&
                    <MoonLanderTitleScreen />
                }

                {(!!world && mode === "PLAY") &&
                    <MoonLanderGame key={world.name}
                        world={world}
                        playerHasDied={playerHasDied}
                        playerHasLanded={playerHasLanded}
                        controls={controls}
                        score={score}
                        isPaused={this.isPaused}
                        handleWorldStatus={this.handleWorldStatus}
                        addPoints={this.addPoints}
                        goToNextLevel={this.goToNextLevel}
                        resetLevel={this.resetLevel}
                    />
                }

                <KeyReader
                    report={(controls: { [index: string]: boolean }) => { this.setState({ controls }) }}
                    reportPress={(command: string) => { this.handleCommandPress(command) }}
                    controlMapping={controlMapping} />
            </main>
        )
    }
}