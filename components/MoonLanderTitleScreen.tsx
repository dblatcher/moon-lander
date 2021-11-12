
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
        </header>
        <div>
            press space to start
        </div>

        {scoreData && <HighScoreTable data={scoreData} />}

    </article>
}