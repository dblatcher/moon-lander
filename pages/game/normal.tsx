import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import FullScreenWrapper from '../../components/FullScreenWrapper'
import GameContainer from '../../components/GameContainer'

import useSWR from 'swr';

import styles from '../../styles/Page.module.scss'

import { ScoreData } from "../../modules/data-access/ScoreData";
import { getStaticConfiguration, PropsWithChildrenAndConfig } from '../../modules/configuration'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    const data: ScoreData = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}


export async function getStaticProps(context: any): Promise<{ props: PropsWithChildrenAndConfig }> {
    return {
        props: { config: getStaticConfiguration() },
    }
}

const NormalGame: NextPage = (props: PropsWithChildrenAndConfig) => {

    const { data, error } = useSWR('/api/scores', fetcher)

    return (
        <div className={styles["full-height-page"]}>

            <Head>
                <title>Normal game page</title>
            </Head>

            <main className={styles["full-height-container"]}>

                <Link href="/" passHref={true}>homepage</Link>

                <FullScreenWrapper>
                    <GameContainer scoreData={data} />
                </FullScreenWrapper>
            </main>
        </div>
    )

}

export default NormalGame