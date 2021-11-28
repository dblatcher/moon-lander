import { Score, ScoreData } from "./ScoreData";

abstract class Database {

    abstract resetDataBase(): Promise<boolean> 
    abstract getScores(): Promise<ScoreData>
    abstract addScore(score: Score): Promise<boolean>

    static initialScores:Score[] = [
        { name: "linda", score: 120, created: 324611200020 },
        { name: "linda", score: 80, created: 324601202000 },
        { name: "bob", score: 60, created: 324601500000 },
        { name: "Gene", score: 100, created: 324631205030 },
    ]
}

export { Database }