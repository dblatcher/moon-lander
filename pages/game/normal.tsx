import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import FullScreenWrapper from '../../components/FullScreenWrapper'
import GameContainer from '../../components/GameContainer'

import styles from '../../styles/Page.module.scss'

const NormalGame: NextPage = () => {

    return (
        <div className={styles["full-height-page"]}>

            <Head>
                <title>Normal game page</title>
            </Head>

            <main className={styles["full-height-container"]}>

                <Link href="/" passHref={true}>homepage</Link>

                <FullScreenWrapper>
                    <GameContainer title="normal game"/>
                </FullScreenWrapper>
            </main>
        </div>
    )

}

export default NormalGame