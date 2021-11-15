import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'


import styles from '../styles/Page.module.scss'

import { ScoreData, Score } from "../modules/ScoreData";
import HighScoreTable from '../components/HighScoreTable';
import { useEffect, useState } from 'react';
import { requestAddScore, requestGetScores, requestResetDbGetFullResponse } from '../modules/data-access/requests';



const NormalGame: NextPage = () => {


    const [highScores, setHighScores] = useState<ScoreData>()
    const [message, setMessage] = useState<string>("")


    const fetchScores = async () => {
        const data = await requestGetScores();

        if (data) {
            console.log(data)
            setHighScores(data);
        } else {
            setMessage("Could not get scores!")
        }
    }

    const addTestScore = async () => {
        const scoreInput: Score = { name: "TEST", score: Math.floor(Math.random() * 100), created: Date.now() }
        const addScoreResult = await requestAddScore(scoreInput)

        if (addScoreResult) {
            setMessage("ADDED SCORE TO DB : " + `${addScoreResult.name} = ${addScoreResult.score}`)
            fetchScores();
        } else {
            setMessage("FAILED ADD SCORE TO DB!")
        }
    }

    const resetDatabase = async (password?: string) => {
        const res = await requestResetDbGetFullResponse(password)

        if (res.status === 200) {
            setMessage("RESET DB!")
            fetchScores();
        } else {
            setMessage("FAILED TO RESET DB!")
            fetchScores();
        }
    }

    useEffect(() => {
        if (!highScores) { fetchScores() }
    })

    return (
        <div className={styles["full-height-page"]}>

            <Head>
                <title>Admin</title>
            </Head>

            <main className={styles["full-height-container"]}>

                <Link href="/" passHref={true}>homepage</Link>

                <h1>admin page</h1>

                <section>
                    <h2>Scores:</h2>
                    {highScores && <HighScoreTable data={highScores} displayErrors />}
                    <button onClick={() => resetDatabase()}>RESET</button>

                    <button onClick={addTestScore}>add test score</button>
                    <p> :: {message}</p>
                </section>

            </main>
        </div>
    )

}

export default NormalGame