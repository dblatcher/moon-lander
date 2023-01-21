import React from "react";
import { LevelIntro } from "../../../modules/LevelIntro";
import Dialogue from "../../Dialogue";
import styles from "./style.module.scss";

export default class MoonLanderLevelIntro extends React.Component {
    props!: Readonly<{
        children?: React.ReactNode;
        levelIntro?: LevelIntro
    }>;

    state!: Readonly<{
        htmlContent?: string
    }>;

    constructor(props: MoonLanderLevelIntro["props"]) {
        super(props)
        this.state = {
            htmlContent: undefined
        }
    }

    componentDidMount() {
        this.loadBreifing()
    }

    loadBreifing() {
        const { levelIntro } = this.props
        if (!levelIntro) { return }

        levelIntro.loadContent()
            .then(htmlContent => {
                setTimeout(() => {
                    this.setState({ htmlContent })
                }, 100);
            })
    }

    render() {
        const { levelIntro } = this.props
        const { htmlContent } = this.state

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

                    {htmlContent ? (
                        <div
                            className={styles.breifingContent}
                            dangerouslySetInnerHTML={{ __html: htmlContent }}>
                        </div>

                    ) : (
                        <div>
                            <h4>Loading mission briefing<span className={styles.blinking}>...</span></h4>
                            <br></br>
                            <br></br>
                        </div>
                    )}

                    <p className={styles.blinking} style={{textAlign:'center'}}>PRESS SPACE TO BEGIN</p>
                </section>
            </Dialogue>
        )
    }
}