
import { Score } from "../../../lib/postgres/arcade-world-scores-table";
import HighScoreTable from "../../HighScoreTable";
import Switch from "../../Switch";
import styles from "./styles.module.scss";

const switchStyle = {
    marginBottom: '.5em',
}

export default function TitleScreen(props: {
    scoreData?: {
        message?: string;
        scores: Score[]
    }
    showHighScores: boolean
    title?: string
    issueCommand?: Function
    soundEnabled: boolean
    showOnScreenControls: boolean
}) {

    const { scoreData, showHighScores, title, issueCommand = () => { }, soundEnabled, showOnScreenControls } = props;

    return <article className={styles.article}>
        <header>
            <h1>Platformer</h1>
            {title && <h2>{title}</h2>}
            <div className={styles.controls}>

                <button className={styles.startButton} onClick={() => { issueCommand('START') }}>START</button>
                <Switch style={switchStyle} label="sound" value={soundEnabled} toggle={() => { issueCommand('SOUNDTOGGLE') }} />
                <Switch style={switchStyle} label="touch controls" value={showOnScreenControls} toggle={() => { issueCommand('CONTROLTOGGLE') }} />
            </div>
            <span className={styles["bottom-rivets"]}></span>
        </header>


        {(showHighScores && scoreData) && (
            <section className={styles.tableWrapper}>
                <HighScoreTable scores={scoreData.scores} errorMessage={scoreData.message} />
            </section>
        )}

    </article>
}