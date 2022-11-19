import type { NextPage } from 'next'
import useSWR from 'swr';
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps, GamePageModel } from '../../modules/configuration'
import { makeFetcher } from '../../modules/configuration/fetchers';
import { moonLander } from '../../modules/moon-lander';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import MoonLanderLevelIntro from '../../components/moon-lander/MoonLanderLevelIntro';
import MoonLanderGame from '../../components/moon-lander/MoonLanderGame';
import MoonLanderTitleScreen from '../../components/moon-lander/MoonLanderTitleScreen';
import styles from '../../styles/Page.module.scss';



const model: GamePageModel = {
    title: moonLander.title,
    modes: moonLander.gameModes,
    route: moonLander.route,
    scoreFetcherUrl: '/api/scores',
}

const GamePage: NextPage = (props: GamePageProps) => {
    const { config = { dataBaseType: 'NONE' }, gameModeKey = "normal" } = props;
    const { data, error } = useSWR(model.scoreFetcherUrl, makeFetcher(config))
    const gameMode = model.modes[gameModeKey]

    return (
        <GamePageTemplate title={`${model.title} - ${gameMode.title}`}>
            <GameContainerTemplate
                scoreData={data}
                isDataBase={config.dataBaseType !== 'NONE'}
                gameMode={gameMode}
                TitleScreenComponent={MoonLanderTitleScreen}
                LevelIntroComponent={MoonLanderLevelIntro}
                GameComponent={MoonLanderGame}
                statusFunctions={moonLander.statusFunctions}
                controlMapping={moonLander.controlMapping}
                extraClassNames={[styles.yellowAndBlackStripes]}
            />
        </GamePageTemplate>
    )

}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(model)
}

export default GamePage