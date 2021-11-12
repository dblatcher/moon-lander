import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import useSWR from 'swr';

import styles from '../styles/Page.module.scss'

import { ScoreData } from "../modules/ScoreData";
import HighScoreTable from '../components/HighScoreTable';
import { useEffect, useState } from 'react';



const NormalGame: NextPage = () => {


    const [highScores, setHighScores] = useState<ScoreData>()


    const requestScores = async() => {
        const res = await fetch("/api/high-scores")
        const data: ScoreData = await res.json()
        setHighScores(data);
    }

    const requestReset = async () => {
        const res = await fetch("/api/reset-db")

        if (res.status === 200) {
            console.log("RESET DB!")
            requestScores();
            return true
        } else {
            console.log("FAILED TO RESET DB!")
            requestScores();
            return false
        }
    }

    useEffect(()=> {
        if (!highScores) {
            requestScores()
        }
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
                    {highScores && <HighScoreTable data={highScores} displayErrors /> }
                    <button onClick={requestReset}>RESET</button>
                </section>

            </main>
        </div>
    )

}

export default NormalGame