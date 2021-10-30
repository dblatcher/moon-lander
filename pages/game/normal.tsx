import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import FullScreenWrapper from '../../components/FullScreenWrapper'
import GameContainer from '../../components/GameContainer'



const NormalGame: NextPage = () => {

    return (
        <div>

            <Head>
                <title>Normal game page</title>
            </Head>

            <main>

                <Link href="/" passHref={true}>homepage</Link>

                <FullScreenWrapper>
                    <GameContainer title="normal game"/>
                </FullScreenWrapper>
            </main>
        </div>
    )

}

export default NormalGame