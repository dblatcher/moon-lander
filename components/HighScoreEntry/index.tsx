import React, { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import Dialogue from "../Dialogue";
import styles from "./styles.module.scss"
import { insertScore } from "../../lib/postgres/arcade-world-scores-table";


export default function HighScoreEntry(props: {
    score: number
    highScoreGameId: string
    exit: { (): Promise<any> }
}) {
    const { score, exit } = props;
    const [name, setName] = useState("")
    const [isInitialRender, setIsInitialRender] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const inputRef: React.MutableRefObject<null | HTMLInputElement> = useRef(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        if (!name || isSubmitting) { return }

        if (!props.highScoreGameId) {
            return exit()
        }

        setIsSubmitting(true);
        insertScore({ score, name, gameId: props.highScoreGameId })
            .then(() => {
                exit()
            })
    }

    useEffect(() => {
        if (inputRef.current && !isInitialRender) {
            setIsInitialRender(true)
            inputRef.current.focus()
        }
    }, [inputRef, isInitialRender])

    const submitButtonClassNames = name.length > 0 ? styles.greenButton : [styles.greenButton, styles["greenButton--disabled"]].join(" ");

    return (
        <Dialogue design="METAL">

            <header className={styles.header}>
                <h2>High Score</h2>
            </header>

            <p>You got {score} points!</p>
            <form className="scoreForm" onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <div className={styles["input-frame"]}>
                        <input className={styles["input"]} ref={inputRef} type="text" value={name} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <button className={styles.orangeButton} onClick={event => { event.preventDefault(); exit(); }}>Don&apos;t enter score</button>
                    <button className={submitButtonClassNames}>Send score</button>
                </div>
            </form>
            <span className={styles["bottom-rivets"]}></span>
        </Dialogue>
    )

}