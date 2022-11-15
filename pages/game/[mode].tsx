import type { NextPage } from 'next'
import useSWR from 'swr';

import { ScoreData } from "../../modules/data-access/ScoreData";
import { ConfigurationProp, getStaticConfiguration, PropsWithChildrenAndConfig } from '../../modules/configuration'
import { gameModes } from '../../modules/moon-lander/gameModes'

import Head from 'next/head'
import Link from 'next/link'
import FullScreenWrapper from '../../components/FullScreenWrapper'
import GameContainer from '../../components/moon-lander/GameContainer'
import styles from '../../styles/Page.module.scss'

const fetcher = async (url: string): Promise<ScoreData> => {
    const res = await fetch(url)
    const data: ScoreData = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}

const dummyFetcher = async (url: string): Promise<ScoreData> => {
    return {
        message: "",
        scores: []
    }
}

const makeFetcher = (config: ConfigurationProp) => {
    if (config.dataBaseType === 'LOCAL') {
        return fetcher;
    }
    return dummyFetcher;
}

interface GamePageProps extends PropsWithChildrenAndConfig {
    gameModeKey?: string
}

const GamePage: NextPage = (props: GamePageProps) => {

    const { config = { dataBaseType: 'NONE' }, gameModeKey = "normal" } = props;
    const { data, error } = useSWR('/api/scores', makeFetcher(config))

    const gameMode = gameModes[gameModeKey]

    return (
        <div className={styles["full-height-page"]}>

            <Head>
                <title>Moon Lander - {gameMode.title}</title>
            </Head>

            <main className={styles["full-height-container"]}>

                <Link href="/" passHref={true}><a>&lArr; homepage</a></Link>

                <FullScreenWrapper>
                    <GameContainer
                        scoreData={data}
                        isDataBase={config.dataBaseType !== 'NONE'}
                        gameMode={gameMode}
                    />
                </FullScreenWrapper>
            </main>
        </div>
    )

}

export const getStaticProps = async (context: { params: { mode: string } }): Promise<{ props: GamePageProps }> => {
    return {
        props: {
            config: getStaticConfiguration(),
            gameModeKey: context.params.mode,
        },
    }
}


export async function getStaticPaths() {
    return {
        paths: Object.keys(gameModes).map(key => `/game/${key}`),
        fallback: false
    }
}

export default GamePage