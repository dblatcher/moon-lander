import React from "react";
import { LevelIntro } from "../../../modules/LevelIntro";
import Dialogue from "../../Dialogue";
import LevelIntroContentLoader from "../../LevelIntroContentLoader";
import styles from "./style.module.scss";

export default class AsteroidLevelIntro extends React.Component {
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
            <Dialogue design="PLAIN">
                <header className={styles.panelHeader}>
                    <label>{levelIntro.title}</label>
                </header>
                <section className={styles.panelBody}>
                    <LevelIntroContentLoader levelIntro={levelIntro} markDownClassName={styles.markdown} />
                    <p className={styles.blinking} style={{ textAlign: 'center' }}>PRESS SPACE TO BEGIN</p>
                </section>
            </Dialogue >
        )
    }
}