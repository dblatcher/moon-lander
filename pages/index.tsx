import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import AnimationCanvas from '../components/AnimationCanvas'
import { createShipCloseUp } from '../modules/animation-factory'
import { asteroidField } from '../modules/asteroid-field'
import { platformGame } from '../modules/platform-game'
import { moonLander } from '../modules/moon-lander'
import GameModeList from '../components/GameModeList'
import { titleAnimation } from '../modules/asteroid-field/titleAnimation'
import VercelFooter from '../components/VercelFooter'

const animationFrameStyle = {
  overflow: 'clip',
  alignSelf: 'center',
  flexShrink: 0,
  marginLeft: 'auto',
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Arcade World</title>
        <meta name="description" content="A collection of physics-based games. Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.frame}>

          <header>
            <h1>Arcade World</h1>
            <span className={styles["bottom-rivets"]}></span>
          </header>

          <GameModeList game={moonLander} >
            <AnimationCanvas
              magnify={.5}
              makeWorld={createShipCloseUp}
              frameStyle={animationFrameStyle} />
          </GameModeList>
          <GameModeList game={platformGame} />
          <GameModeList game={asteroidField}>
            <AnimationCanvas
              magnify={.5}
              makeWorld={titleAnimation}
              frameStyle={animationFrameStyle} />
          </GameModeList>

          <p>
            <Link href={`/about`} passHref={true}>
              <a>about this site &rArr;</a>
            </Link>
          </p>

        </div>
      </main>

      <VercelFooter />
    </div>
  )
}

export default Home
