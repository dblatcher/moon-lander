import { GameMode } from "../../modules/GameMode";
import styles from "./styles.module.scss";

export default function NumberPanel(props: Readonly<{
    gameMode: GameMode
    level: number
    score: number
    lives: number
}>) {

    const { gameMode, level, score, lives } = props;

    return (
        <aside className={styles.numberPanel}>
            <div>level: <span>{level}</span></div>
            {!gameMode.noScores && <div>score: <span>{score}</span></div>}
            {isFinite(gameMode.startingLives) && <div>lives: <span>{lives}</span></div>}
            <span className={styles["bottom-rivets"]}></span>
        </aside>
    )
}