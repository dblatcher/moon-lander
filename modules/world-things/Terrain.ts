import { Body, BodyData, Force, RenderFunctions, ViewPort } from "physics-worlds";
import { CollisionReport } from "physics-worlds/dist/src/collisionDetection";
import { Point } from "physics-worlds/dist/src/geometry";
import { SpaceShip } from "./SpaceShip";

interface TerrainData extends BodyData {
    pattern?: "BUILDING"
    relativeWidth?: number
}

class Terrain extends Body {
    data: TerrainData
    windows?: Point[][]

    constructor(data: TerrainData) {
        const elasticity = data.elasticity || Terrain.DEFAULT_ELASTICITY;
        super(data)
        this.data = data;
        this.data.immobile = true
        this.data.elasticity = elasticity;

        if (this.data.pattern === "BUILDING") {
            this.windows = this.createWindows()
        }

    }

    static DEFAULT_ELASTICITY = .1
    get typeId() { return "Terrain" }

    duplicate() {
        const myPrototype = Object.getPrototypeOf(this)
        return new myPrototype.constructor(Object.assign({}, this.data, { pattern: undefined }), new Force(this.momentum.magnitude, this.momentum.direction))
    }

    createWindows(): Point[][] {
        const { x, y, size = 10, relativeWidth = 1 } = this.data
        const windowSize = 30;

        const buildingHeight = size;
        const buildingWidth = size * relativeWidth;
        const area = (buildingHeight * buildingWidth)

        const numberOfWindows = Math.min(35, Math.floor(area / 2500));

        const rows = Math.floor(buildingHeight / windowSize) - 1;
        const cols = Math.floor(buildingWidth / windowSize) - 1;

        const windows = []

        for (let i = 0; i < numberOfWindows; i++) {
            let wy = windowSize * (Math.floor(Math.random() * rows) * (Math.random() > .5 ? 1 : -1));
            let wx = windowSize * (Math.floor(Math.random() * cols) * (Math.random() > .5 ? 1 : -1));

            windows.push([
                { x: x + wx, y: y + wy },
                { x: x + wx + windowSize, y: y + wy },
                { x: x + wx + windowSize, y: y + wy + windowSize },
                { x: x + wx, y: y + wy + windowSize }
            ])

        }

        return windows;
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        Body.prototype.renderOnCanvas.apply(this, [ctx, viewPort]);

        if (this.windows) {
            const { color = 'white' } = this.data;
            this.windows.forEach(window => {
                RenderFunctions.renderPolygon.onCanvas(ctx, window, { strokeColor: color, fillColor: 'black', lineWidth: 2 }, viewPort);
            })
        }
    }

    respondToImpact(report: CollisionReport) {

        const otherThing = report.item1 === this ? report.item2 : report.item1
        const { magnitude: impactSpeed } = otherThing.momentum;

        if (otherThing instanceof SpaceShip &&  impactSpeed > .1) {
            this.world.emitter.emit("SFX", { soundName: 'bang', options: { volume: .5 } })
        }
    }
}

export { Terrain }