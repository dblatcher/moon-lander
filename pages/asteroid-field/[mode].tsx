import type { NextPage } from 'next'
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps } from '../../modules/configuration'
import { asteroidField } from '../../modules/asteroid-field';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import AsteroidLevelIntro from '../../components/asteroid-field/AsteroidLevelIntro';
import AsteroidGame from '../../components/asteroid-field/AsteroidLanderGame';
import AsteroidTitleScreen from '../../components/asteroid-field/AsteroidTitleScreen';
import styles from '../../components/asteroid-field/asteroids.style.module.scss'



const { title, gameModes, highScoreGameId, songs } = asteroidField

const GamePage: NextPage = (props: GamePageProps) => {
    const { config = { dataBaseType: 'NONE' }, gameModeKey = "normal" } = props;
    const gameMode = gameModes[gameModeKey]

    return (
        <GamePageTemplate title={`${title} - ${gameMode.title}`}>
            <GameContainerTemplate
                isDataBase={config.dataBaseType !== 'NONE'}
                gameMode={gameMode}
                TitleScreenComponent={AsteroidTitleScreen}
                LevelIntroComponent={AsteroidLevelIntro}
                GameComponent={AsteroidGame}
                statusFunctions={asteroidField.statusFunctions}
                controlMapping={asteroidField.controlMapping}
                soundEffects={asteroidField.soundEffects}
                extraClassNames={[styles.asteroids]}
                songs={songs}
                highScoreGameId={highScoreGameId}
            />
        </GamePageTemplate>
    )

}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(asteroidField)
}

export default GamePage