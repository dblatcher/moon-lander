import React from "react";
import { LevelIntro } from "../../../modules/LevelIntro";
import Dialogue from "../../Dialogue";

import styles from "./style.module.scss";

export default class IntroDialogue extends React.Component<{
    children?: React.ReactNode;
    levelIntro?: LevelIntro
}, {
    htmlContent?: string
}> {

    constructor(props: IntroDialogue["props"]) {
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
            <Dialogue design="YELLOW">
                <section className={styles.lcdScreen}>

                    {htmlContent ? (
                        <div
                            className={styles.breifingContent}
                            dangerouslySetInnerHTML={{ __html: htmlContent }}>
                        </div>

                    ) : (
                        <div>
                            <h4>Loading intro<span className={styles.blinking}>...</span></h4>
                            <br></br>
                            <br></br>
                        </div>
                    )}

                    <p className={styles.blinking} style={{ textAlign: 'center' }}>PRESS SPACE TO BEGIN</p>
                </section>
            </Dialogue>
        )
    }
}