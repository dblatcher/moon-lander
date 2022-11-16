import type { NextPage } from 'next'
import useSWR from 'swr';
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps, GamePageModel } from '../../modules/configuration'
import { plaformGameModes } from '../../modules/platform-game/platformGameModes'
import GameContainer from '../../components/platform-game/GameContainer'
import { makeFetcher } from '../../modules/configuration/fetchers';
import GamePageTemplate from '../../components/GamePageTemplate';

const model: GamePageModel = {
    title: 'Platforms',
    modes: plaformGameModes,
    route: 'platform',
    scoreFetcherUrl: '/api/scores',
}

const GamePage: NextPage = (props: GamePageProps) => {
    const { config = { dataBaseType: 'NONE' }, gameModeKey = "normal" } = props;
    const { data, error } = useSWR(model.scoreFetcherUrl, makeFetcher(config))
    const gameMode = model.modes[gameModeKey]

    return (
        <GamePageTemplate title={`${model.title} - ${gameMode.title}`}>
            <GameContainer
                scoreData={data}
                isDataBase={config.dataBaseType !== 'NONE'}
                gameMode={gameMode} />
        </GamePageTemplate>
    )
}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(model)
}

export default GamePage