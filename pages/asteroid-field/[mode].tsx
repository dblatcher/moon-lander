import type { NextPage } from 'next'
import useSWR from 'swr';
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps } from '../../modules/configuration'
import { makeFetcher } from '../../modules/configuration/fetchers';
import { asteroidField } from '../../modules/asteroid-field';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import AsteroidLevelIntro from '../../components/asteroid-field/AsteroidLevelIntro';
import AsteroidGame from '../../components/asteroid-field/AsteroidLanderGame';
import AsteroidTitleScreen from '../../components/asteroid-field/AsteroidTitleScreen';

import styles from '../../styles/Page.module.scss'


const { title, gameModes, scoreFetcherUrl } = asteroidField

const GamePage: NextPage = (props: GamePageProps) => {
    const { config = { dataBaseType: 'NONE' }, gameModeKey = "normal" } = props;
    const { data, error } = useSWR(scoreFetcherUrl, makeFetcher(config))
    const gameMode = gameModes[gameModeKey]

    return (
        <GamePageTemplate title={`${title} - ${gameMode.title}`}>
            <GameContainerTemplate
                scoreData={data}
                isDataBase={config.dataBaseType !== 'NONE'}
                gameMode={gameMode}
                TitleScreenComponent={AsteroidTitleScreen}
                LevelIntroComponent={AsteroidLevelIntro}
                GameComponent={AsteroidGame}
                statusFunctions={asteroidField.statusFunctions}
                controlMapping={asteroidField.controlMapping}
                soundEffects={asteroidField.soundEffects}
                extraClassNames={[styles.asteroids]}
            />
        </GamePageTemplate>
    )

}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(asteroidField)
}

export default GamePage