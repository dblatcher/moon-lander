import type { NextPage } from 'next'
import useSWR from 'swr';
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps, GamePageModel } from '../../modules/configuration'
import { gameModes } from '../../modules/moon-lander/gameModes'
import { makeFetcher } from '../../modules/configuration/fetchers';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import MoonLanderLevelIntro from '../../components/moon-lander/MoonLanderLevelIntro';
import MoonLanderGame from '../../components/moon-lander/MoonLanderGame';
import MoonLanderTitleScreen from '../../components/moon-lander/MoonLanderTitleScreen';
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from '../../modules/moon-lander/moonLanderWorldValues';

const model: GamePageModel = {
    title: 'Moon Lander',
    modes: gameModes,
    route: 'moon-lander',
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
                statusFunctions={{
                    isChangeToFailure,
                    isChangeToVictory,
                    getWorldStatus,
                    playerIsInactive,
                }}
                controlMapping={{
                    "w": "up",
                    "ArrowUp": "up",
                    "a": "left",
                    "ArrowLeft": "left",
                    "d": "right",
                    "ArrowRight": "right",
                    "s": "down",
                    "ArrowDown": "down",
                    " ": "START",
                    "p": "PAUSE",
                    "P": "PAUSE",
                    "O": "CONTROLTOGGLE",
                    "o": "CONTROLTOGGLE",
                }}
            />
        </GamePageTemplate>
    )

}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(model)
}

export default GamePage