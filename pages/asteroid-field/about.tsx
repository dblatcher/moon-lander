import type { NextPage } from 'next'
import Link from 'next/link'
import AnimationCanvas from '../../components/AnimationCanvas'
import AboutPageTemplate from '../../components/AboutPageTemplate'
import { wanderingRoids } from '../../modules/animation-factory'
import styles from "../../components/asteroid-field/asteroids.style.module.scss"
import AboutContent from './AboutContent.mdx'

const Home: NextPage = () => {
  return (
    <AboutPageTemplate title='MoonLander - About' mainClassNames={[styles.asteroids, styles.aboutPage]}>

      <AnimationCanvas makeWorld={wanderingRoids} frameClass={styles.fullScreenAnimation} />
      <div className={styles.aboutFrame}>

        <div className={styles.markdown}>
          <AboutContent />
        </div>
        <p>
          <Link legacyBehavior href="/asteroid-field/normal" passHref={true}><a>&lArr; back to game</a></Link>
        </p>
        <p>
          <Link legacyBehavior href="/about" passHref={true}><a>&lArr; about site</a></Link>
        </p>
        <p>
          <Link legacyBehavior href="/" passHref={true}><a>&lArr; homepage</a></Link>
        </p>

      </div>
    </AboutPageTemplate>
  )
}

export default Home
