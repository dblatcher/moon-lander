
import styles from "./MoonLanderTitleScreen.module.scss";

export default function  MoonLanderTitleScreen(props: {

}) {

    return <article className={styles.article}>
        <header>
            <h1>MOON LANDER</h1>
        </header>
        <div>
            press space to start
        </div>
    </article>
}