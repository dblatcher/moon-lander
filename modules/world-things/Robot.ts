import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing, Physics } from 'physics-worlds'
import { Bullet } from './Bullet'
import { DustCloud } from './DustCloud'
import { LandingPad, RefuelPad } from './LandingPad'
import { Terrain } from './Terrain'


const {
    getPolygonLineSegments, doLineSegmentsIntersect, getUnitVectorBetweenPoints, getDirection,
    getVectorX, getVectorY, reverseHeading, getXYVector, translatePoint, _deg
} = Geometry

const { calculateDragForce } = Physics

interface RobotData extends BodyData {

    headingFollowsDirection?: false
    fillColor?: string
    maxImpact?: number

    facing: 'LEFT' | 'RIGHT'
    rolling?: 'LEFT' | 'RIGHT'
    shootCooldownDuration?: number
    shootCooldownCurrent?: number
    jumpCooldownDuration?: number
    jumpCooldownCurrent?: number
    instanceId?: string
}

class Robot extends Body {
    data: RobotData

    constructor(config: RobotData, momentum: Force = Force.none) {
        super(config, momentum);
        this.data = config
        this.data.color = config.color || 'red'
        this.data.fillColor = config.fillColor || 'white'

        this.data.shootCooldownCurrent = 0
        this.data.shootCooldownDuration = config.shootCooldownDuration || 20
        this.data.jumpCooldownCurrent = 0
        this.data.jumpCooldownDuration = config.jumpCooldownDuration || 20
        this.data.facing = config.facing || 'LEFT'
    }

    get typeId() { return 'Robot' }

    static negligableSpeed = 0.2
    static MAX_IMPACT_SPEED = 3
    static PLAYER_INSTANCE_ID = 'player'

    get seemsStill(): boolean {
        const { momentum } = this
        if (momentum.magnitude > Robot.negligableSpeed) { return false }
        return true
    }

    get isPlayer() {
        return this.data.instanceId === Robot.PLAYER_INSTANCE_ID;
    }

    get terrainAndEdge(): { body: Body, surface: [Geometry.Point, Geometry.Point] } | undefined {

        const { } = this.world

        if (!this.seemsStill) { return undefined }
        const { bottom, x, y, top } = this.boundingRectangle

        const possibleTerrain = this.world.bodies
            .filter(body => {
                const { boundingRectangle } = body
                return body instanceof Terrain && boundingRectangle.left < x && boundingRectangle.right > x && boundingRectangle.y > bottom
            })

        if (!possibleTerrain) { return undefined }

        const quarterHeight = (bottom - top) / 4
        const lineDownMiddle: [Geometry.Point, Geometry.Point] = [{ x, y: bottom - quarterHeight }, { x, y: bottom + quarterHeight }]

        for (let i = 0; i < possibleTerrain.length; i++) {
            const body = possibleTerrain[i];
            const edges = getPolygonLineSegments(body.polygonPoints)
            const intersectedEdge = edges.find(edge => doLineSegmentsIntersect(lineDownMiddle, edge))
            if (intersectedEdge) {
                return { body, surface: intersectedEdge }
            }
        }

        return undefined
    }

    get landingPadIsRestingOn(): LandingPad | undefined {

        if (!this.seemsStill) { return undefined }
        const landingPads = this.world.bodies.filter(body => body instanceof LandingPad) as LandingPad[];

        return landingPads.find(landingPad => {
            const edges = Geometry.getPolygonLineSegments(landingPad.polygonPoints)
            const closestPoints = edges.map(edge => Geometry.closestPointOnLineSegment(...edge, this.shapeValues))
            const distance = Math.min(...closestPoints.map(point => Geometry.getDistanceBetweenPoints(point, this.shapeValues))) - this.shapeValues.radius

            // need to allow some threshold for tiny bouncing
            return distance < 1

            // TO DO - distinguish being ON TOP of the landing pad and begin next to it
            // using global gravity direction
        })
    }

    tick() {
        const { shootCooldownCurrent = 0, jumpCooldownCurrent = 0, } = this.data;
        if (shootCooldownCurrent > 0) { this.data.shootCooldownCurrent = shootCooldownCurrent - 1 }
        if (jumpCooldownCurrent > 0) { this.data.jumpCooldownCurrent = jumpCooldownCurrent - 1 }
    }


    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { x, y, size = 0, heading = 0, color, fillColor, facing } = this.data
        const { shapeValues } = this

        const chasis: Geometry.Wedge = {
            x: x, y: y,
            radius: size,
            heading: heading,
            angle: Geometry._deg * 240,
        }

        const tilt = facing === 'LEFT' ? Geometry._deg * 10 : Geometry._deg * -10;

        const cockpit: Geometry.Wedge = {
            x: x, y: y,
            radius: size * (2 / 3),
            heading: heading + tilt,
            angle: Geometry._deg * 150,
        }

        const vRight = getXYVector(size, heading + Geometry._90deg);
        const vRightHalf = getXYVector(size / 2, heading + Geometry._90deg);
        const vBack = getXYVector(size, heading - (Geometry._deg * 180))

        const rightPoint = translatePoint(shapeValues, vRight)
        const rightBackPoint = translatePoint(rightPoint, vBack)
        const rightBackLeftPoint = translatePoint(rightBackPoint, vRightHalf, true)
        const rightLeftPoint = translatePoint(rightBackLeftPoint, vBack, true)

        const rightLeg: Geometry.Point[] = [
            rightPoint, rightBackPoint, rightBackLeftPoint, rightLeftPoint
        ]


        const leftPoint = translatePoint(shapeValues, vRight, true)
        const leftBackPoint = translatePoint(leftPoint, vBack)
        const leftBackRightPoint = translatePoint(leftBackPoint, vRightHalf)
        const leftRightPoint = translatePoint(leftBackRightPoint, vBack, true)

        const leftLeg: Geometry.Point[] = [
            leftPoint, leftBackPoint, leftBackRightPoint, leftRightPoint
        ]

        RenderFunctions.renderWedge.onCanvas(ctx, chasis, { fillColor: fillColor, lineWidth: 1 / 2 }, viewPort);
        RenderFunctions.renderWedge.onCanvas(ctx, cockpit, { fillColor: color, lineWidth: 1 / 2 }, viewPort);
        RenderFunctions.renderPolygon.onCanvas(ctx, leftLeg, { strokeColor: color, fillColor: "gray" }, viewPort)
        RenderFunctions.renderPolygon.onCanvas(ctx, rightLeg, { strokeColor: color, fillColor: "gray" }, viewPort)
    }

    updateMomentum() {

        const { rolling } = this.data
        const { terrainAndEdge, gravitationalForces, mass, upthrustForces } = this

        if (!terrainAndEdge) {
            gravitationalForces.magnitude = gravitationalForces.magnitude / mass
        } else {
            gravitationalForces.magnitude = 0
        }

        upthrustForces.magnitude = upthrustForces.magnitude / mass

        let rollForce = Force.none
        if (rolling && terrainAndEdge) {
            // to do - check the left-right direction of the surface
            const reverse = rolling === 'RIGHT'
            const unitVector = getUnitVectorBetweenPoints(...terrainAndEdge.surface)
            const direction = reverse ? reverseHeading(getDirection(unitVector.x, unitVector.y)) : getDirection(unitVector.x, unitVector.y)
            rollForce = new Force(3, direction)
        }

        const drag = calculateDragForce(this, Force.combine([this.momentum, gravitationalForces, upthrustForces, rollForce]))
        this.momentum = Force.combine([this.momentum, gravitationalForces, upthrustForces, rollForce, drag])
        this.otherBodiesCollidedWithThisTick = []
    }

    explode(config: {
        driftBiasX?: number
        driftBiasY?: number
    } = {}) {
        const { size = 1, color = 'red' } = this.data;
        const { driftBiasX = 0, driftBiasY = 0 } = config

        this.leaveWorld()

        new ExpandingRing({
            x: this.data.x,
            y: this.data.y,
            duration: 50,
            size: size * 2,
            color: this.data.color,
        }).enterWorld(this.world)

        new ExpandingRing({
            x: this.data.x,
            y: this.data.y,
            duration: 60,
            size: size * 3,
            color: 'white',
        }).enterWorld(this.world)

        new ExpandingRing({
            x: this.data.x,
            y: this.data.y,
            duration: 70,
            size: size * 4,
            color: this.data.color,
        }).enterWorld(this.world)

        new DustCloud({
            size: 1,
            numberOfSpecs: 50,
            x: this.data.x,
            y: this.data.y,
            duration: 100,
            driftSpeed: 1,
            driftBiasX: driftBiasX * (1 / 3),
            driftBiasY: driftBiasY * (1 / 3),
            colors: ['white', color, color]
        }).enterWorld(this.world)

        this.world.soundDeck?.playSample('die')
    }

    handleCollision(report: CollisionDetection.CollisionReport) {

        const { magnitude: impactSpeed } = this.momentum;
        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing instanceof Terrain) {
            const elasticityAdjustment = 1 - (otherThing.data.elasticity || 1);
            const adjustedImpactSpeed = impactSpeed * elasticityAdjustment;

            if (adjustedImpactSpeed > Robot.MAX_IMPACT_SPEED) {
                this.explode({
                    driftBiasX: -this.momentum.vectorX / this.momentum.magnitude * 2,
                    driftBiasY: -this.momentum.vectorY / this.momentum.magnitude * 2
                })
            }
        }

        if (otherThing instanceof Robot) {
            this.explode();
            (otherThing as Robot).explode();
        }
        Body.prototype.handleCollision(report)
    }


    respondToImpact(report: CollisionDetection.CollisionReport) {

        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing instanceof Robot) {
            this.explode();
            (otherThing as Robot).explode();
        }
    }

    shoot() {
        if (!this.world) { return }
        const { shootCooldownCurrent = 0, size = 1, facing } = this.data

        const heading = facing === 'LEFT' ? -Geometry._90deg : Geometry._90deg

        if (shootCooldownCurrent > 0) { return }
        this.data.shootCooldownCurrent = this.data.shootCooldownDuration

        const bullet = new Bullet({
            x: this.data.x + getVectorX(size + 5, heading),
            y: this.data.y + getVectorY(size + 5, heading),
            color: 'red',
            fillColor: 'red',
            ticksRemaining: 150,
        }, new Force(20, heading))

        bullet.enterWorld(this.world)
    }

    bounce(direction: "LEFT" | "RIGHT" | "UP") {
        const { jumpCooldownCurrent = 0 } = this.data
        const { terrainAndEdge: onGround } = this
        this.data.facing = direction !== 'UP' ? direction : this.data.facing
        if (jumpCooldownCurrent > 0) { return }
        if (!this.world || !onGround) { return }
        this.data.jumpCooldownCurrent = this.data.jumpCooldownDuration
        const angle = direction === 'LEFT' ? -135 : direction === 'RIGHT' ? 135 : 180
        const jumpForce = new Force(2, angle * Geometry._deg)
        this.momentum = Force.combine([this.momentum, jumpForce])
    }

    roll(direction: "LEFT" | "RIGHT") {
        this.data.facing = direction
        this.data.rolling = direction
    }

    stop() {
        this.data.rolling = undefined
    }

    leaveWorld(): void {
        Body.prototype.leaveWorld.apply(this, [])
    }

}

export type { RobotData }
export { Robot }