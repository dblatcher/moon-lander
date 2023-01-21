import React from "react";
import { LevelIntro } from "../../../modules/LevelIntro";
import Dialogue from "../../Dialogue";
import LevelIntroContentLoader from "../../LevelIntroContentLoader";
import styles from "./style.module.scss";

export default class AsteroidLevelIntro extends React.Component<{
    children?: React.ReactNode;
    levelIntro?: LevelIntro
}> {

    render() {
        const { levelIntro } = this.props

        return (
            <Dialogue design="PLAIN">
                <header className={styles.panelHeader}>
                    <label>{levelIntro?.title}</label>
                </header>
                <section className={styles.panelBody}>
                    {levelIntro && (
                        <LevelIntroContentLoader
                            levelIntro={levelIntro}
                            markDownClassName={styles.markdown} />
                    )}

                    <p className={styles.blinking} style={{ textAlign: 'center' }}>PRESS SPACE TO BEGIN</p>
                </section>
            </Dialogue >
        )
    }
}