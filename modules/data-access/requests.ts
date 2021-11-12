import { Score, ScoreData } from "../ScoreData";

async function requestAddScoreGetFullResponse(score: Score) {
    return await fetch("/api/scores", {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(score)
    })
}

async function requestAddScore(score: Score): Promise<null | Score> {
    const res = await requestAddScoreGetFullResponse(score);
    if (res.status !== 200) { return null }
    const confirmedScore: Score = await res.json();
    return confirmedScore;
}

async function requestGetScoresGetFullResponse() {
    return await fetch("/api/scores")
}

async function requestGetScores(): Promise<null | ScoreData> {
    const res = await requestGetScoresGetFullResponse()
    if (res.status !== 200) { return null }
    const scoreData: ScoreData = await res.json();
    return scoreData
}

//TO DO - SECURE THIS END POINT!
async function requestResetDbGetFullResponse(password?: string) {
    return await fetch("/api/reset-db")
}


export {
    requestGetScores,
    requestAddScore,
    requestResetDbGetFullResponse,
}