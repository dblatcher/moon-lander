import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { Score, ScoreData } from "../modules/ScoreData";

const initialScores: Score[] = [
    { name: "linda", score: 200 },
    { name: "linda", score: 170 },
    { name: "bob", score: 100 },
    { name: "Gene", score: 355 },
]


export async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    })
}


export async function resetDataBase(): Promise<boolean> {
    console.log("RESETTING DB")
    const db = await openDb();

    await db.exec('DROP TABLE IF EXISTS scores');
    await db.exec('CREATE TABLE scores (name TEXT, score INT)');

    initialScores.forEach(async row => {
        await db.run(
            'INSERT INTO scores VALUES (?, ?)',
            row.name, row.score
        )
    })

    return true
}

export async function getScores(): Promise<ScoreData> {
    const scoreData: ScoreData = {
        message: "",
        scores: []
    }

    const db = await openDb();

    try {
        const results = await db.all('SELECT name,score FROM scores') as Score[];

        results.forEach(result => {
            scoreData.scores.push(result)
        })

    } catch (error) {
        console.warn("**getScores error", error)
        scoreData.message = "FAILED TO GET SCORES"
    }

    return scoreData
}

export async function addScore(score: Score): Promise<boolean> {
    const db = await openDb();

    try {

        await db.run(
            'INSERT INTO scores VALUES (?, ?)',
            score.name, score.score
        )

        return true
    } catch (error) {
        console.warn("**addScore error", error)
        return false
    }
}