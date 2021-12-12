import React from "react";
import { LevelIntro } from "../../modules/LevelIntro";

import styles from "./style.module.scss";

export default class MoonLanderLevelIntro extends React.Component {
    props!: Readonly<{
        children?: React.ReactNode;
        levelIntro?: LevelIntro
    }>;

    constructor(props: MoonLanderLevelIntro["props"]) {
        super(props)

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
                <h3>{levelIntro.title}</h3>
                {levelIntro.message?.map(line => <p>{line}</p>)}
            </article>
        )
    }
}