import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import GameContainer from '../../components/GameContainer'



const NormalGame: NextPage = () => {

    return (
        <div>

            <Head>
                <title>Normal game page</title>
            </Head>

            <main>

                <Link href="/" passHref={true}>homepage</Link>

                <GameContainer title="normal game"/>
            </main>
        </div>
    )

}

export default NormalGame