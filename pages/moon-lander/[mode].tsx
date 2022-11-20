import type { NextPage } from 'next'
import useSWR from 'swr';
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps } from '../../modules/configuration'
import { makeFetcher } from '../../modules/configuration/fetchers';
import { moonLander } from '../../modules/moon-lander';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import MoonLanderLevelIntro from '../../components/moon-lander/MoonLanderLevelIntro';
import MoonLanderGame from '../../components/moon-lander/MoonLanderGame';
import MoonLanderTitleScreen from '../../components/moon-lander/MoonLanderTitleScreen';

import styles from '../../styles/Page.module.scss'

const { title, gameModes, scoreFetcherUrl } = moonLander

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
                TitleScreenComponent={MoonLanderTitleScreen}
                LevelIntroComponent={MoonLanderLevelIntro}
                GameComponent={MoonLanderGame}
                statusFunctions={moonLander.statusFunctions}
                controlMapping={moonLander.controlMapping}
                soundEffects={moonLander.soundEffects}
                extraClassNames={[styles.yellowAndBlackStripes]}
            />
        </GamePageTemplate>
    )

}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(moonLander)
}

export default GamePage