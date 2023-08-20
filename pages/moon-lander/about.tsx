import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../../styles/Home.module.scss'
import AnimationCanvas from '../../components/AnimationCanvas'
import { createShipCloseUp } from '../../modules/animation-factory'
import AboutPageTemplate from '../../components/AboutPageTemplate'
import AboutContent from './AboutContent.mdx'

const Home: NextPage = () => {
  return (
    <AboutPageTemplate title='MoonLander - About' mainClassNames={[styles.main]}>

      <div className={styles.frame}>

        <div className={styles.markdown}>
          <AboutContent />
        </div>

        <p>
          <Link legacyBehavior href="/moon-lander/normal" passHref={true}><a>&lArr; back to game</a></Link>
        </p>
        <p>
          <Link legacyBehavior href="/about" passHref={true}><a>&lArr; about site</a></Link>
        </p>
        <p>
          <Link legacyBehavior href="/" passHref={true}><a>&lArr; homepage</a></Link>
        </p>

        <AnimationCanvas makeWorld={createShipCloseUp}
          magnify={.5}
          frameClass={styles.cornerAnimation} />

      </div>
    </AboutPageTemplate>
  )
}

export default Home
