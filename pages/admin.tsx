import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'


import styles from '../styles/Page.module.scss'

import { useEffect, useState } from 'react';
import { requestAddScore, requestGetScores, requestResetDbGetFullResponse } from '../modules/data-access/requests';
import { getStaticConfiguration, PropsWithChildrenAndConfig } from '../modules/configuration';
import ScoreSection from '../components/admin/ScoreSection';
import { Score, ScoreData } from '../modules/data-access/ScoreData';
import DataSection from '../components/admin/DataSection';


export async function getStaticProps(context: any): Promise<{ props: PropsWithChildrenAndConfig }> {
    return {
        props: { config: getStaticConfiguration() },
    }
}

// TO DO - add admin user logins :
// https://nextjs.org/docs/authentication  
// https://github.com/vercel/next.js/tree/canary/examples/with-iron-session

const AdminPage: NextPage = (props: PropsWithChildrenAndConfig) => {

    const { config } = props;
    const [dataMessage, setDataMessage] = useState<string>("")
    const [highScores, setHighScores] = useState<ScoreData>()
    const [scoresMessage, setScoresMessage] = useState<string>("")

    const resetDatabase = async (passwordEntry: string) => {
        const res = await requestResetDbGetFullResponse(passwordEntry)

        if (res.status === 200) {
            setDataMessage("RESET DB!")
            fetchScores()
        } else {
            setDataMessage("FAILED TO RESET DB!")
        }
    }

    const fetchScores = async () => {
        const data = await requestGetScores();

        if (data) {
            console.log(data)
            setHighScores(data);
        } else {
            setScoresMessage("Could not get scores!")
        }
    }


    const addTestScore = async () => {
        const scoreInput: Score = { name: "TEST", score: Math.floor(Math.random() * 100), created: Date.now() }
        const addScoreResult = await requestAddScore(scoreInput)

        if (addScoreResult) {
            setScoresMessage("ADDED SCORE TO DB : " + `${addScoreResult.name} = ${addScoreResult.score}`)
            fetchScores();
        } else {
            setScoresMessage("FAILED ADD SCORE TO DB!")
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

            <main className={""}>

                <Link href="/" passHref={true}>homepage</Link>

                <h1>admin page</h1>

                <section>
                    <h2>App Configuration</h2>
                    {config && Object.keys(config).map(key => <p key={key}><b>{key}: </b>{config[key]}</p>)}
                </section>

                <DataSection
                    message={dataMessage}
                    resetDatabase={resetDatabase}
                />

                <ScoreSection
                    message={scoresMessage}
                    addTestScore={addTestScore}
                    highScores={highScores} />

            </main>
        </div>
    )

}

export default AdminPage