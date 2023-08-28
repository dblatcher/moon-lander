import type { NextPage } from 'next'
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps } from '../../modules/configuration'
import { controlMapping } from '../../modules/platform-game/controlRobot';
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from '../../modules/platform-game/platformGameWorldValues';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import TitleScreen from '../../components/platform-game/TitleScreen';
import IntroDialogue from '../../components/platform-game/IntroDialogue';
import GamePlayer from '../../components/platform-game/GamePlayer';
import { platformGame } from '../../modules/platform-game';

const { title, gameModes, highScoreGameId } = platformGame

const GamePage: NextPage = (props: GamePageProps) => {
    const { config = { dataBaseType: 'NONE' }, gameModeKey = "normal" } = props;
    const gameMode = gameModes[gameModeKey]

    return (
        <GamePageTemplate title={`${title} - ${gameMode.title}`}>
            <GameContainerTemplate
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
                soundEffects={platformGame.soundEffects}
                songs={platformGame.songs}
                highScoreGameId={highScoreGameId}
            />
        </GamePageTemplate>
    )
}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(platformGame)
}

export default GamePage