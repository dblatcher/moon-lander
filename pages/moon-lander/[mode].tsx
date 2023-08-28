import type { NextPage } from 'next'
import { GamePageProps, getGamePageStaticPaths, buildGameGetStaticProps } from '../../modules/configuration'
import { moonLander } from '../../modules/moon-lander';
import GamePageTemplate from '../../components/GamePageTemplate';
import GameContainerTemplate from '../../components/GameContainerTemplate';
import MoonLanderLevelIntro from '../../components/moon-lander/MoonLanderLevelIntro';
import MoonLanderGame from '../../components/moon-lander/MoonLanderGame';
import MoonLanderTitleScreen from '../../components/moon-lander/MoonLanderTitleScreen';
import styles from '../../components/moon-lander/moonLander.styles.module.scss'

const { title, gameModes, highScoreGameId, songs } = moonLander

const GamePage: NextPage = (props: GamePageProps) => {
    const { config = { dataBaseType: 'NONE' }, gameModeKey = "normal" } = props;
    const gameMode = gameModes[gameModeKey]

    return (
        <GamePageTemplate title={`${title} - ${gameMode.title}`}>
            <GameContainerTemplate
                isDataBase={config.dataBaseType !== 'NONE'}
                gameMode={gameMode}
                TitleScreenComponent={MoonLanderTitleScreen}
                LevelIntroComponent={MoonLanderLevelIntro}
                GameComponent={MoonLanderGame}
                statusFunctions={moonLander.statusFunctions}
                controlMapping={moonLander.controlMapping}
                soundEffects={moonLander.soundEffects}
                extraClassNames={[styles.yellowAndBlackStripes]}
                songs={moonLander.songs}
                highScoreGameId={highScoreGameId}
            />
        </GamePageTemplate>
    )

}

export const getStaticProps = buildGameGetStaticProps()


export async function getStaticPaths() {
    return getGamePageStaticPaths(moonLander)
}

export default GamePage