import type { NextPage } from 'next'
import useSWR from 'swr';
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps, GamePageModel } from '../../modules/configuration'
import { makeFetcher } from '../../modules/configuration/fetchers';
import { controlMapping } from '../../modules/platform-game/controlRobot';
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from '../../modules/platform-game/platformGameWorldValues';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import TitleScreen from '../../components/platform-game/TitleScreen';
import IntroDialogue from '../../components/platform-game/IntroDialogue';
import GamePlayer from '../../components/platform-game/GamePlayer';
import { platformGame } from '../../modules/platform-game';
import styles from '../../styles/Page.module.scss'

const model: GamePageModel = {
    title: platformGame.title,
    modes: platformGame.gameModes,
    route: platformGame.route,
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
                TitleScreenComponent={TitleScreen}
                LevelIntroComponent={IntroDialogue}
                GameComponent={GamePlayer}
                statusFunctions={{
                    isChangeToFailure,
                    isChangeToVictory,
                    getWorldStatus,
                    playerIsInactive,
                }}
                controlMapping={controlMapping}
                extraClassNames={[styles.red]}
            />
        </GamePageTemplate>
    )
}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(model)
}

export default GamePage