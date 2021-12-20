import { RenderTransformationRule, Body, ViewPort, shapes, RenderFunctions, Area } from "physics-worlds"


const makeTerrainBlack = new RenderTransformationRule(
    thing => (thing as Body|Area).typeId === 'Terrain',
    (thing, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {
        const duplicate: Body = thing.duplicate();

        duplicate.data.color = "black";
        duplicate.data.fillColor = "black"
        duplicate.renderOnCanvas(ctx, viewPort)
    }
)

const highlightLandingPad = new RenderTransformationRule(
    thing => (thing as Body|Area).typeId ==='LandingPad',
    (body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {
        const duplicate: Body = body.duplicate();

        duplicate.data.color = "rgb(0,255,0)";
        duplicate.data.fillColor = "rgb(0,255,0)";
        duplicate.renderOnCanvas(ctx, viewPort)

        const circleFill = Date.now()%1000 > 500 ? "white" : undefined;

        RenderFunctions.renderCircle.onCanvas(ctx,
            { x: body.data.x, y: body.data.y, radius: viewPort.visibleLineWidth * 10 },
            { strokeColor:circleFill, lineWidth:viewPort.pointRadius },
            viewPort);
    }
)

const spaceShipIsRedCircle = new RenderTransformationRule(
    thing => (thing as Body|Area).typeId === 'SpaceShip',
    (body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {

        const marker = new Body({
            x: body.data.x,
            y: body.data.y,
            fillColor: 'red',
            size: viewPort.pointRadius * 15,
            shape: shapes.circle,
        })
        marker.renderOnCanvas(ctx, viewPort)


        const circleRadius = 3 + Math.floor (Date.now() % 500 / 50);
        RenderFunctions.renderCircle.onCanvas(ctx,
            { x: body.data.x, y: body.data.y, radius: viewPort.visibleLineWidth * circleRadius },
            { strokeColor:"white", lineWidth:viewPort.pointRadius },
            viewPort);
    }
)

const noAreas = new RenderTransformationRule(
    thing => thing instanceof(Area),
    (area, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {

    }
)

export {
    makeTerrainBlack, spaceShipIsRedCircle, highlightLandingPad, noAreas
}