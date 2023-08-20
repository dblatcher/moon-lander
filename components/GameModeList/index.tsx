import Link from "next/link";
import { ReactNode } from "react";
import { GameDefinition } from "../../modules/types";
import styles from './styles.module.scss';


interface Props {
    game: GameDefinition
    children?: ReactNode
}

const GameModeList = ({ game, children }: Props) => {

    return (<section className={styles.container}>
        <h2>{game.title}</h2>
        <ul className={styles.gameModeList}>
            {Object.keys(game.gameModes).filter(key => !game.gameModes[key].hidden).map(key => (
                <li key={key} >
                    <Link legacyBehavior key={key} href={`/${game.route}/${key}`} passHref={true}>
                        <a>
                            <h3>{game.gameModes[key].title}</h3>
                        </a>
                    </Link>
                </li>
            ))}
        </ul>
        {children}
    </section>)
}

export default GameModeList