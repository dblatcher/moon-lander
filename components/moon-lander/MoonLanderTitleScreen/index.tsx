
import Link from "next/link";
import { createShipCloseUp } from "../../../modules/animation-factory";
import { Score } from "../../../lib/postgres/arcade-world-scores-table";
import AnimationCanvas from "../../AnimationCanvas";
import HighScoreTable from "../../HighScoreTable";
import Switch from "../../Switch";
import styles from "./MoonLanderTitleScreen.module.scss";

const switchStyle = {
    marginBottom: '.5em',
}

const frameStyle = {
    border: "2px solid yellow",
    borderRadius: '50%',
    overflow: 'clip',
    alignSelf: 'center',
    flexShrink: 0,
    margin: '1em 0',
}

export default function MoonLanderTitleScreen(props: {
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
            <h1>MOON LANDER</h1>
            {title && <h2>{title}</h2>}
            <div>
                <button className={styles.startButton} onClick={() => { issueCommand('START') }}>START</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Switch style={switchStyle} label="sound" value={soundEnabled} toggle={() => { issueCommand('SOUNDTOGGLE') }} />
                <Switch style={switchStyle} label="touch controls" value={showOnScreenControls} toggle={() => { issueCommand('CONTROLTOGGLE') }} />
            </div>

            <div>
                <Link legacyBehavior passHref href="/moon-lander/about"><a >about this game</a></Link>
            </div>

            <span className={styles["bottom-rivets"]}></span>
        </header>

        <AnimationCanvas makeWorld={createShipCloseUp}
            magnify={.8}
            frameStyle={frameStyle} />


        {(showHighScores && scoreData) && (
            <section className={styles.tableWrapper}>
                <HighScoreTable scores={scoreData.scores} errorMessage={scoreData.message} />
            </section>
        )}

    </article>
}