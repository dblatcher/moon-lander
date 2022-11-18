
import { createShipCloseUp } from "../../../modules/animation-factory";
import { ScoreData } from "../../../modules/data-access/ScoreData";
import AnimationCanvas from "../../AnimationCanvas";
import HighScoreTable from "../../HighScoreTable";
import Switch from "../../Switch";
import styles from "./MoonLanderTitleScreen.module.scss";

const switchStyle = {
    marginBottom: '.5em',
}

export default function AsteroidTitleScreen(props: {
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
            <AnimationCanvas makeWorld={createShipCloseUp}
                magnify={.75}
                frameClass={styles.cornerAnimation} />

            <h1>Asteroid field</h1>
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
                <HighScoreTable data={scoreData} />
            </section>
        )}

    </article>
}