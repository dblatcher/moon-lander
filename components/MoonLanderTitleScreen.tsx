
import { ScoreData } from "../modules/data-access/ScoreData";
import HighScoreTable from "./HighScoreTable";
import styles from "./MoonLanderTitleScreen.module.scss";

export default function MoonLanderTitleScreen(props: {
    scoreData?: ScoreData
    isDataBase: boolean
    title?: string
}) {

    const { scoreData, isDataBase, title } = props;

    return <article className={styles.article}>
        <header>
            <h1>MOON LANDER</h1>
            {title && <h2>{title}</h2> }
            <span className={styles["bottom-rivets"]}></span>
        </header>
        <div className="message">
            <p>press space to start</p>
        </div>


        {(isDataBase && scoreData) && (
            <section className={styles.tableWrapper}>
                <HighScoreTable data={scoreData} />
            </section>
        )}

    </article>
}