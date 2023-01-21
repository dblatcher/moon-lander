import React from "react";
import { LevelIntro } from "../../../modules/LevelIntro";
import Dialogue from "../../Dialogue";
import LevelIntroContentLoader from "../../LevelIntroContentLoader";
import styles from "./style.module.scss";

export default class MoonLanderLevelIntro extends React.Component {
    props!: Readonly<{
        children?: React.ReactNode;
        levelIntro?: LevelIntro
    }>;


    render() {
        const { levelIntro } = this.props

        if (!levelIntro) {
            return (
                <article className={styles.article}>
                    <h3>NO TITLE</h3>
                </article>
            )
        }

        return (
            <Dialogue design="METAL">
                <header className={styles.panelHeader}>
                    <label>Misson Briefing</label>
                </header>
                <section className={styles.lcdScreen}>
                    <LevelIntroContentLoader
                        levelIntro={levelIntro}
                        loadingClassName={styles.loadingMessage}
                        loadingContent={<>
                            <h4>Loading mission briefing<span>...</span></h4>
                            <br></br>
                            <br></br>
                        </>}
                    />
                    <p className={styles.blinking} style={{ textAlign: 'center' }}>PRESS SPACE TO BEGIN</p>
                </section>
            </Dialogue>
        )
    }
}