import React from "react";
import { LevelIntro } from "../../../modules/LevelIntro";
import Dialogue from "../../Dialogue";

import styles from "./style.module.scss";

export default class AsteroidLevelIntro extends React.Component {
    props!: Readonly<{
        children?: React.ReactNode;
        levelIntro?: LevelIntro
    }>;

    state!: Readonly<{
        htmlContent?: string
    }>;

    constructor(props: AsteroidLevelIntro["props"]) {
        super(props)
        this.state = {
            htmlContent: undefined
        }
    }

    get introNeedsToFetchContent(): boolean {
        return !!(!this.props.levelIntro?.ContentComponent && this.props.levelIntro?.filename)
    }

    componentDidMount() {
        if (this.introNeedsToFetchContent) {
            this.loadBreifing()
        }
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
        const ContentComponent = levelIntro ? levelIntro.ContentComponent : undefined;

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

                    {this.introNeedsToFetchContent && (<>
                        {
                            htmlContent ? (
                                <div
                                    className={styles.breifingContent}
                                    dangerouslySetInnerHTML={{ __html: htmlContent }} >
                                </div>

                            ) : (
                                <div>
                                    <h4>Loading mission briefing<span className={styles.blinking}>...</span></h4>
                                    <br></br>
                                    <br></br>
                                </div>
                            )}
                    </>)}

                    {ContentComponent && (
                        <ContentComponent />
                    )}

                    <p className={styles.blinking} style={{ textAlign: 'center' }}>PRESS SPACE TO BEGIN</p>
                </section>
            </Dialogue >
        )
    }
}