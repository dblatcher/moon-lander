import { RenderTransformationRule, Body, ViewPort, shapes, RenderFunctions } from "physics-worlds"

const makeTerrainGray = new RenderTransformationRule(
    body => body.typeId === 'Terrain',
    (body: Body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {
        const duplicate: Body = body.duplicate();

        duplicate.data.color = "gray";
        duplicate.data.fillColor = "gray"
        duplicate.renderOnCanvas(ctx, viewPort)
    }
)

const highlightLandingPad = new RenderTransformationRule(
    body => body.typeId === 'LandingPad',
    (body: Body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {
        const duplicate: Body = body.duplicate();

        duplicate.data.color = "rgb(0,255,0)";
        duplicate.data.fillColor = "rgb(0,255,0)";
        duplicate.renderOnCanvas(ctx, viewPort)

        const circleFill = Date.now()%1000 > 500 ? "rgb(0,255,0)" : undefined;

        RenderFunctions.renderCircle.onCanvas(ctx,
            { x: body.data.x, y: body.data.y, radius: viewPort.visibleLineWidth * 10 },
            { strokeColor:circleFill, lineWidth:viewPort.visibleLineWidth },
            viewPort);
    }
)

const spaceShipIsRedCircle = new RenderTransformationRule(
    body => body.typeId === 'SpaceShip',
    (body: Body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {

        const marker = new Body({
            x: body.data.x,
            y: body.data.y,
            fillColor: 'red',
            size: viewPort.pointRadius * 15,
            shape: shapes.circle,
        })
        marker.renderOnCanvas(ctx, viewPort)
    }
)


export {
    makeTerrainGray, spaceShipIsRedCircle, highlightLandingPad
}