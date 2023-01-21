import React from "react";
import { LevelIntro } from "../../../modules/LevelIntro";
import Dialogue from "../../Dialogue";
import LevelIntroContentLoader from "../../LevelIntroContentLoader";
import styles from "./style.module.scss";

export default class MoonLanderLevelIntro extends React.Component<{
    children?: React.ReactNode;
    levelIntro?: LevelIntro
}> {

    render() {
        const { levelIntro } = this.props
        return (
            <Dialogue design="METAL">
                <header className={styles.panelHeader}>
                    <label>Misson Briefing</label>
                </header>
                <section className={styles.lcdScreen}>
                    {!!levelIntro ? (
                        <LevelIntroContentLoader
                            levelIntro={levelIntro}
                            loadingClassName={styles.loadingMessage}
                            loadingContent={<>
                                <h4>Loading mission briefing<span>...</span></h4>
                                <br></br>
                                <br></br>
                            </>}
                        />
                    ) : (
                        <p>No mission briefing available</p>
                    )}
                    <p className={styles.blinking} style={{ textAlign: 'center' }}>PRESS SPACE TO BEGIN</p>
                </section>
            </Dialogue>
        )
    }
}