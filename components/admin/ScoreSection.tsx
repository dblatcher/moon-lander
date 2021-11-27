
import { ScoreData } from "../../modules/data-access/ScoreData";
import HighScoreTable from '../../components/HighScoreTable';
import { MouseEventHandler } from 'react';

export default function ScoreSection(props: {
    addTestScore: MouseEventHandler<HTMLButtonElement>
    message:string
    highScores?: ScoreData
}) {

    const {addTestScore, highScores, message} = props;

    return (
        <section>
            <h2>Scores:</h2>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                    <button onClick={addTestScore}>add test score</button>
                    <p> :: {message}</p>
                </div>
                {highScores && <HighScoreTable data={highScores} displayErrors />}
            </div>
        </section>
    )
}