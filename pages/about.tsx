import type { NextPage } from 'next'
import Link from 'next/link'
import AnimationCanvas from '../components/AnimationCanvas'
import AboutPageTemplate from '../components/AboutPageTemplate'
import { createShipCloseUp } from '../modules/animation-factory'
import styles from '../styles/Home.module.scss'


const Home: NextPage = () => {
  return (
    <AboutPageTemplate title='About' mainClassNames={[styles.main]}>
      <div className={styles.frame}>
        <h2>About</h2>
        <p>This site has free browser games.</p>
        <p>More of my free games can be found at <a className={styles.exLink} href="http://www.davidblatcher.co.uk/">http://www.davidblatcher.co.uk/</a>.</p>

        <h3>Technical</h3>
        <p>The games use my <a className={styles.exLink} href="https://github.com/dblatcher/worlds">physics-worlds</a> package to create the game levels. Physics-worlds is a flexible, object-orientated typescript physics engine intended for building games, simulations and animations.</p>
        <p>The source code is available at <a className={styles.exLink} href="https://github.com/dblatcher/moon-lander">https://github.com/dblatcher/moon-lander</a>.</p>
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
