import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../../styles/Home.module.scss'
import AnimationCanvas from '../../components/AnimationCanvas'
import { createShipCloseUp } from '../../modules/animation-factory'
import AboutPageTemplate from '../../components/AboutPageTemplate'



const Home: NextPage = () => {
  return (
    <AboutPageTemplate title='MoonLander - About' mainClassNames={[styles.main]}>

      <div className={styles.frame}>

        <h2>Moon-lander</h2>
        <p>Moon-lander is a free browser game in which you pilot a small landing craft in a variety of planetary and deep space environments. The sucessfull pilot will need to cope with different atmospheres, terrains and levels of gravity to land safely.</p>
        <p>More of my free games can be found at <a className={styles.exLink} href="http://www.davidblatcher.co.uk/">http://www.davidblatcher.co.uk/</a>.</p>

        <p>
          <Link href="/moon-lander/normal" passHref={true}><a>&lArr; back to game</a></Link>
        </p>
        <p>
          <Link href="/about" passHref={true}><a>&lArr; about site</a></Link>
        </p>
        <p>
          <Link href="/" passHref={true}><a>&lArr; homepage</a></Link>
        </p>

        <AnimationCanvas makeWorld={createShipCloseUp}
          magnify={.5}
          frameClass={styles.cornerAnimation} />

      </div>
    </AboutPageTemplate>
  )
}

export default Home
