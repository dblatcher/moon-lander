
import { ScoreData } from "../modules/ScoreData";
import HighScoreTable from "./HighScoreTable";
import styles from "./MoonLanderTitleScreen.module.scss";

export default function MoonLanderTitleScreen(props: {
    scoreData?: ScoreData
}) {

    const { scoreData } = props;

    return <article className={styles.article}>
        <header>
            <h1>MOON LANDER</h1>
            <span className={styles["bottom-rivets"]}></span>
        </header>
        <div className="message">
            <p>press space to start</p>
        </div>


        {scoreData && (
            <section className={styles.tableWrapper}>
                <HighScoreTable data={scoreData} />
            </section>
        )}

    </article>
}