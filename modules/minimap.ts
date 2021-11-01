import { RenderTransformationRule, Body, ViewPort, shapes } from "physics-worlds"

const makeTerrainWhite = new RenderTransformationRule(
    body => body.typeId === 'Terrain',
    (body: Body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {
        const duplicate: Body = body.duplicate();

        duplicate.data.color = "white";
        duplicate.data.fillColor = "white"
        duplicate.renderOnCanvas(ctx, viewPort)
    }
)

const spaceShipIsRedCircle = new RenderTransformationRule(
    body => body.typeId === 'SpaceShip',
    (body: Body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {

        const marker = new Body({
            x:body.data.x,
            y:body.data.y,
            fillColor:'red',
            size:viewPort.pointRadius * 15,
            shape:shapes.circle,
        })
        marker.renderOnCanvas(ctx,viewPort)
    }
)


export {
    makeTerrainWhite, spaceShipIsRedCircle
}