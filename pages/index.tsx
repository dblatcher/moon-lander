import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import { gameModes } from '../modules/GameMode'


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.frame}>

          <header>
            <h1>MOON LANDER</h1>
            <span className={styles["bottom-rivets"]}></span>
          </header>

          <ul className={styles.gameModeList}>
            {Object.keys(gameModes).map(key => (
              <li key={key} >
                <Link key={key} href={`/game/${key}`} passHref={true}>
                <a>
                  <h2>{gameModes[key].title}</h2>
                </a>
                </Link>
              </li>
          ))}
          </ul>

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
