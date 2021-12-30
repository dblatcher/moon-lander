import { SoundPlayer } from "physics-worlds";
import GameContainer from "../components/GameContainer";

interface PlayOptions {
    volume?: number
}

interface SfxPayload {
    soundName: string
    options?: PlayOptions
}


function makeSoundPlayer(gameContainer: GameContainer) {

    const player = new SoundPlayer({
        die: "/audio/die.mp3",
        bang: "/audio/bang.mp3",
    })
    player.defineTone('beep', { frequency: 1000, endFrequency: 2000, volume: .125, duration: .5, type:'sine' })
    player.defineTone('hum', { frequency: 300, endFrequency: 300, volume: .02, duration: 1, type: 'sawtooth' })

    gameContainer.world?.emitter.on('SFX', gameContainer.playSound)
    gameContainer.world?.emitter.on('TONE', gameContainer.playTone)

    return player
}

export type { SfxPayload }
export { makeSoundPlayer }