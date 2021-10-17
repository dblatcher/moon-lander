import React from "react";
import react from "react";
import { World } from "physics-worlds";
import { Command, makeWorld, respondToCommand } from "../modules/worldFactory";
import Controls from "./Controls";
import FullCanvas from "./FullCanvas";
import styles from "./GameContainer.module.scss";

interface GameContainerProps {
    title: string
}


export type { GameContainerProps }

export default class GameContainer extends react.Component {
    props!: GameContainerProps;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    world: World

    constructor(props: GameContainerProps) {
        super(props);
        this.canvasRef = React.createRef();


        this.world = makeWorld()
        this.world.ticksPerSecond = 50
        this.togglePaused = this.togglePaused.bind(this)
        this.handleInput = this.handleInput.bind(this)
    }

    togglePaused() {
        this.world.ticksPerSecond = this.world.ticksPerSecond ? 0 : 50
    }

    handleInput(key: Command) {
        return respondToCommand(this.world, key);
    }

    render() {
        const { title } = this.props;

        return (
            <main className={styles.component}>

                <h2>{title}</h2>
                <button onClick={this.togglePaused}>pause</button>
                <FullCanvas world={this.world} />
                <Controls handleInput={this.handleInput} />
            </main>
        )
    }
}