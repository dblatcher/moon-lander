import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'


import styles from '../styles/Page.module.scss'

import { ScoreData, Score } from "../modules/data-access/ScoreData";
import HighScoreTable from '../components/HighScoreTable';
import { useEffect, useState } from 'react';
import { requestAddScore, requestGetScores, requestResetDbGetFullResponse } from '../modules/data-access/requests';


// TO DO - add admin user logins :
// https://nextjs.org/docs/authentication  
// https://github.com/vercel/next.js/tree/canary/examples/with-iron-session

const AdminPage: NextPage = () => {


    const [highScores, setHighScores] = useState<ScoreData>()
    const [message, setMessage] = useState<string>("")
    const [passwordEntry, setPasswordEntry] = useState<string>("");


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

    const resetDatabase = async () => {
        const res = await requestResetDbGetFullResponse(passwordEntry)

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
                    <div>
                    <button onClick={() => resetDatabase()}>RESET</button>
                    <input type="text" value={passwordEntry} onChange={event => {setPasswordEntry(event.target.value)}} placeholder="enter reset password"/>
                    </div>
                    <button onClick={addTestScore}>add test score</button>
                    <p> :: {message}</p>

                    {highScores && <HighScoreTable data={highScores} displayErrors />}
                </section>

            </main>
        </div>
    )

}

export default AdminPage