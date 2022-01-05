import { AbstractFill, BackGround, RenderFunctions, ViewPort } from "physics-worlds";

interface DistantPlanetData {
    x: number
    y: number
    radius?: number
    parallax?: number
    fillColor?: AbstractFill | string
}

class DistantPlanet extends BackGround {
    data: Required<DistantPlanetData>

    constructor(config: DistantPlanetData) {
        super()
        this.data = Object.assign({}, DistantPlanet.defaultConfig, config);
    }

    static defaultConfig: Required<DistantPlanetData> = {
        x: 0, y: 0, fillColor: 'red', radius: 100, parallax: 1
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort): void {
        const { fillColor, parallax } = this.data
        console.log(this)
        RenderFunctions.renderCircle.onCanvas(ctx, this.data, { fillColor, parallax }, viewPort)
    }
}

export type { DistantPlanetData }
export { DistantPlanet }