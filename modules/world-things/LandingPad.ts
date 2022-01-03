import { BodyData, RenderFunctions, shapes, SoundControl, ViewPort } from "physics-worlds";
import { SpaceShip } from "./SpaceShip";
import { Terrain } from "./Terrain";

class LandingPad extends Terrain {

    constructor(data: BodyData) {
        const elasticity = data.elasticity || LandingPad.DEFAULT_ELASTICITY;
        super(data)
        this.data.immobile = true
        this.data.elasticity = elasticity;
    }

    static DEFAULT_ELASTICITY = .3
    get typeId() { return "LandingPad" }
}


interface LandingPadData extends BodyData {
    fuel: number
    maxFuel: number
    renderIndicator?: boolean
}

class RefuelPad extends LandingPad {
    data: LandingPadData;
    noise?: SoundControl | null

    constructor(data: LandingPadData) {
        super(data)
        const elasticity = data.elasticity || LandingPad.DEFAULT_ELASTICITY;
        this.data = data
        this.data.immobile = true
        this.data.elasticity = elasticity;
    }

    get typeId() { return "RefuelPad" }
    refuelRate = 10

    refuel(ship: SpaceShip) {
        const { fuel } = this.data;
        const { fuel: shipFuel = 0, maxFuel: shipMax = 0 } = ship.data

        if (fuel > 0 && (shipFuel < shipMax)) {
            const amount = Math.min(this.refuelRate, fuel, shipMax - shipFuel);
            this.data.fuel = fuel - amount;
            ship.data.fuel = shipFuel + amount;
            this.playRefuelSound();
        }
    }

    playRefuelSound() {
        if (this.world.soundDeck) {
            if (!this.noise) {
                this.noise = this.world.soundDeck.playTone({
                    frequency: 125,
                    endFrequency: 150,
                    duration: .5,
                    type: 'square'
                }, { volume: .05 })
                this.noise?.whenEnded.then(() => {
                    this.noise = undefined
                })
            }
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort): void {
        LandingPad.prototype.renderOnCanvas.apply(this, [ctx, viewPort])
        const { maxFuel, fuel, renderIndicator } = this.data;

        if (!renderIndicator) { return }
        const barHeight = 100

        const startPoint = { x: this.shapeValues.right, y: this.shapeValues.y }
        const fuelEndPoint = { x: startPoint.x, y: startPoint.y - (barHeight * (fuel / maxFuel)) }
        const maxEndPoint = { x: startPoint.x, y: startPoint.y - barHeight }

        RenderFunctions.renderLine.onCanvas(ctx, [startPoint, maxEndPoint], {
            lineWidth: viewPort.visibleLineWidth * 1.5, strokeColor: 'black'
        }, viewPort)

        RenderFunctions.renderLine.onCanvas(ctx, [startPoint, fuelEndPoint], {
            lineWidth: viewPort.visibleLineWidth, strokeColor: 'red'
        }, viewPort)
    }
}

export { LandingPad, RefuelPad }