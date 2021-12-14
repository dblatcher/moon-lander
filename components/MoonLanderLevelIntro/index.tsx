import React from "react";
import { LevelIntro } from "../../modules/LevelIntro";

import styles from "./style.module.scss";

export default class MoonLanderLevelIntro extends React.Component {
    props!: Readonly<{
        children?: React.ReactNode;
        levelIntro?: LevelIntro
    }>;

    state!: Readonly<{
        htmlContent: string
    }>;

    constructor(props: MoonLanderLevelIntro["props"]) {
        super(props)
        this.state = {
            htmlContent: ""
        }
    }

    componentDidMount() {
        const { levelIntro } = this.props
        if (!levelIntro) { return }

        levelIntro.loadContent()
            .then(htmlContent => {
                this.setState({
                    htmlContent
                })
            })
    }

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
            <article className={styles.article}>
                <div dangerouslySetInnerHTML={{ __html: this.state.htmlContent }}>
                </div>
            </article>
        )
    }
}