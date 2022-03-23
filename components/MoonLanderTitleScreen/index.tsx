
import { ScoreData } from "../../modules/data-access/ScoreData";
import HighScoreTable from "../HighScoreTable";
import Switch from "../Switch";
import styles from "./MoonLanderTitleScreen.module.scss";

export default function MoonLanderTitleScreen(props: {
    scoreData?: ScoreData
    showHighScores: boolean
    title?: string
    issueCommand?: Function
    soundEnabled: boolean
    showOnScreenControls: boolean
}) {

    const { scoreData, showHighScores, title, issueCommand = () => { }, soundEnabled, showOnScreenControls } = props;

    return <article className={styles.article}>
        <header>
            <h1>MOON LANDER</h1>
            {title && <h2>{title}</h2>}
            <span className={styles["bottom-rivets"]}></span>
        </header>
        <div className={styles.controls}>
            <button className={styles.startButton} onClick={() => { issueCommand('START') }}>START</button>

            <Switch label="sound" value={soundEnabled} toggle={() => { issueCommand('SOUNDTOGGLE') }} />
            <Switch label="touch controls" value={showOnScreenControls} toggle={() => { issueCommand('CONTROLTOGGLE') }} />
        </div>


        {(showHighScores && scoreData) && (
            <section className={styles.tableWrapper}>
                <HighScoreTable data={scoreData} />
            </section>
        )}

    </article>
}