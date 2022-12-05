import type { NextPage } from 'next'
import Link from 'next/link'

import AnimationCanvas from '../../components/AnimationCanvas'

import AboutPageTemplate from '../../components/AboutPageTemplate'

import styles from "../../components/asteroid-field/asteroids.style.module.scss"
import { wanderingRoids } from '../../modules/animation-factory'

const Home: NextPage = () => {
  return (
    <AboutPageTemplate title='MoonLander - About' mainClassNames={[styles.asteroids, styles.aboutPage]}>

      <AnimationCanvas makeWorld={wanderingRoids} frameClass={styles.fullScreenAnimation} />
      <div className={styles.aboutFrame}>

        <h2>Asteroid field</h2>

        <q>One more direct hit and we&apos;re done for!</q>
        <p>Clear the deadly asteroid fields!</p>

        <p>
          <Link href="/asteroid-field/normal" passHref={true}><a>&lArr; back to game</a></Link>
        </p>
        <p>
          <Link href="/about" passHref={true}><a>&lArr; about site</a></Link>
        </p>
        <p>
          <Link href="/" passHref={true}><a>&lArr; homepage</a></Link>
        </p>

      </div>
    </AboutPageTemplate>
  )
}

export default Home
