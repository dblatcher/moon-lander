import React, { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import { requestAddScore } from "../../modules/data-access/requests";
import styles from "./styles.module.scss"


export default function HighScoreEntry(props: {
    score: number
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
        setIsSubmitting(true);
        requestAddScore({ score, name, created: Date.now() })
            .then(() => {
                exit()
            })
    }

    useEffect(() => {
        if (inputRef.current && !isInitialRender) {
            setIsInitialRender(true)
            inputRef.current.focus()
        }
    })

    const submitButtonClassNames = name.length > 0 ? styles.greenButton : [styles.greenButton, styles["greenButton--disabled"]].join(" ");

    return (
        <article className={styles.frame}>

            <header>
                <h2>High Score</h2>
            </header>

            <p>You got {score} points!</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <div className={styles["input-frame"]}>
                        <input ref={inputRef} type="text" value={name} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <button className={styles.orangeButton} onClick={event => { event.preventDefault(); exit(); }}>Don't enter score</button>
                    <button className={submitButtonClassNames}>Send score</button>
                </div>
            </form>
            <span className={styles["bottom-rivets"]}></span>
        </article>
    )

}