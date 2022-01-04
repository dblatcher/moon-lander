import { Body, BodyData, Force, LinearGradientFill, RenderFunctions, ViewPort } from "physics-worlds";
import { CollisionReport } from "physics-worlds/dist/src/collisionDetection";
import { Point } from "physics-worlds/dist/src/geometry";
import { SpaceShip } from "./SpaceShip";

interface TerrainData extends BodyData {
    pattern?: "BUILDING"
    relativeWidth?: number
}

const windowFill = new LinearGradientFill({
    fallbackColor: 'skyblue',
    canvasFunction: (ctx: CanvasRenderingContext2D, line: [Point, Point]) => {
        const gradient = ctx.createLinearGradient(line[0].x, line[0].y, line[1].x, line[1].y);
        gradient.addColorStop(0, 'skyblue');
        gradient.addColorStop(0.1, 'skyblue');
        gradient.addColorStop(.9, 'white');
        gradient.addColorStop(1, 'black');
        return gradient
    }
})

class Terrain extends Body {
    data: TerrainData
    imageSource?: CanvasImageSource

    constructor(data: TerrainData) {
        const elasticity = data.elasticity || Terrain.DEFAULT_ELASTICITY;
        super(data)
        this.data = data;
        this.data.immobile = true
        this.data.elasticity = elasticity;

        if (this.data.pattern === "BUILDING") {
            this.preRenderWindows()
        }
    }

    static DEFAULT_ELASTICITY = .1
    get typeId() { return "Terrain" }

    duplicate() {
        const myPrototype = Object.getPrototypeOf(this)
        return new myPrototype.constructor(Object.assign({}, this.data, { pattern: undefined }), new Force(this.momentum.magnitude, this.momentum.direction))
    }

    createWindows(windowSize: number): Point[][] {
        const { boundingRectangle } = this
        const buildingWidth = boundingRectangle.right - boundingRectangle.left
        const buildingHeight = boundingRectangle.bottom - boundingRectangle.top

        const rows = Math.floor(buildingHeight / windowSize) - 3;
        const cols = Math.floor(buildingWidth / windowSize) - 2;
        const numberOfWindows = Math.min(25, rows * cols / 2);

        const windows = []
        for (let i = 0; i < numberOfWindows; i++) {
            let wy = windowSize * (1 + Math.floor(Math.random() * rows));
            let wx = windowSize * (1 + Math.floor(Math.random() * cols));
            windows.push([
                { x: wx, y: wy },
                { x: wx + windowSize, y: wy },
                { x: wx + windowSize, y: wy + windowSize },
                { x: wx, y: wy + windowSize }
            ])
        }

        return windows;
    }

    preRenderWindows() {

        const { boundingRectangle } = this
        const width = boundingRectangle.right - boundingRectangle.left
        const height = boundingRectangle.bottom - boundingRectangle.top

        const pad = document.createElement('canvas');
        pad.width = width
        pad.height = height
        const ctx = pad.getContext('2d')
        if (!ctx) { return }

        const viewPort = new ViewPort({ canvas: pad, width, height, x: width / 2, y: height / 2 })

        const windows = this.createWindows(50)
        windows.forEach(window => {
            RenderFunctions.renderPolygon.onCanvas(ctx, window, { strokeColor: 'black', fillColor: windowFill }, viewPort)
        })

        this.imageSource = pad
    }

    renderShadow(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { boundingRectangle } = this
        const shadowDepth = (boundingRectangle.right-boundingRectangle.left)/5

        const points: Point[] = [
            { x: boundingRectangle.right, y: boundingRectangle.top },
            { x: boundingRectangle.right + shadowDepth, y: boundingRectangle.top + shadowDepth*.75 },
            { x: boundingRectangle.right + shadowDepth, y: boundingRectangle.bottom },
            { x: boundingRectangle.right, y: boundingRectangle.bottom },
        ]

        RenderFunctions.renderPolygon.onCanvas(ctx, points, { fillColor: 'rgba(0,0,0,.5)' }, viewPort);
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        if (this.data.pattern === 'BUILDING') {
            this.renderShadow(ctx, viewPort)
        }
        Body.prototype.renderOnCanvas.apply(this, [ctx, viewPort]);

        if (this.imageSource) {
            const leftEdge = Math.min(...this.polygonPoints.map(point => point.x));
            const topEdge = Math.min(...this.polygonPoints.map(point => point.y));
            let topLeft = viewPort.mapPoint({ x: leftEdge, y: topEdge })
            ctx.drawImage(this.imageSource, topLeft.x, topLeft.y)
        }
    }

    respondToImpact(report: CollisionReport) {

        const otherThing = report.item1 === this ? report.item2 : report.item1
        const { magnitude: impactSpeed } = otherThing.momentum;
        if (otherThing instanceof SpaceShip && impactSpeed > SpaceShip.negligableSpeed / 2) {
            this.world.soundDeck?.playSample('bang', { volume: 1 })
        }
    }
}

export { Terrain }