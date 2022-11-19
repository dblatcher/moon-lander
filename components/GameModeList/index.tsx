import Link from "next/link";
import { GameDefinition } from "../../modules/types";
import styles from '../../styles/Home.module.scss';

interface Props {
    game: GameDefinition
}

const GameModeList = ({ game }: Props) => {

    return (<section style={{ display: 'flex', alignItems: 'center' }}>
        <h2>{game.title}</h2>
        <ul className={styles.gameModeList}>
            {Object.keys(game.gameModes).filter(key => !game.gameModes[key].hidden).map(key => (
                <li key={key} >
                    <Link key={key} href={`/${game.route}/${key}`} passHref={true}>
                        <a>
                            <h3>{game.gameModes[key].title}</h3>
                        </a>
                    </Link>
                </li>
            ))}
        </ul>
    </section>)
}

export default GameModeList