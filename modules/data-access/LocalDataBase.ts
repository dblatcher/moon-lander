import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { Database } from "./DataBase";
import { Score, ScoreData } from "./ScoreData";


class LocalDatabase extends Database {

    async openDb() {
        return open({
            filename: './database.db',
            driver: sqlite3.Database
        })
    }

    async resetDataBase(): Promise<boolean> {
        console.log("RESETTING DB")
        const connection = await this.openDb();

        await connection.exec('DROP TABLE IF EXISTS scores');
        await connection.exec(`CREATE TABLE scores (
            name TEXT NOT NULL, 
            score INT DEFAULT 0,
            created INT
        )`);

        LocalDatabase.initialScores.forEach(async row => {
            await connection.run(
                'INSERT INTO scores VALUES (?, ?, ?)',
                row.name, row.score, row.created || null
            )
        })

        return true
    }

    async getScores(): Promise<ScoreData> {
        const scoreData: ScoreData = {
            message: "",
            scores: []
        }
        const connection = await this.openDb();
        try {
            const results = await connection.all('SELECT * FROM scores ORDER BY score DESC') as Score[];

            results.forEach(result => {
                scoreData.scores.push(result)
            })
        } catch (error) {
            console.warn("**getScores error", error)
            scoreData.message = "FAILED TO GET SCORES"
        }
        return scoreData
    }


    async addScore(score: Score): Promise<boolean> {
        const connection = await this.openDb();

        try {
            await connection.run(
                'INSERT INTO scores VALUES (?, ?, ?)',
                score.name, score.score, score.created || null
            )
            return true
        } catch (error) {
            console.warn("**addScore error", error)
            return false
        }
    }

}

export { LocalDatabase }