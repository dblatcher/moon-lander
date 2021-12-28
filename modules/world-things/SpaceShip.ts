import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing } from 'physics-worlds'
import { Bullet } from './Bullet'
import { DustCloud } from './DustCloud'
import { LandingPad, RefuelPad } from './LandingPad'
import { Terrain } from './Terrain'

const { getVectorX, getVectorY, reverseHeading, getXYVector, translatePoint, _360deg } = Geometry

interface SpaceShipData extends BodyData {
    x: number
    y: number
    heading?: number
    size?: number
    color?: string
    density?: number
    shape?: Shape
    elasticity?: number

    headingFollowsDirection?: false
    fillColor?: string
    thrust?: number
    maxThrust?: number
    maxImpact?: number

    maxFuel?: number
    fuel?: number

    shootCooldownDuration?: number
    shootCooldownCurrent?: number
}

class SpaceShip extends Body {
    data: SpaceShipData
    ticksBeenStrandedFor: number

    constructor(config: SpaceShipData, momentum: Force = Force.none) {
        super(config, momentum);
        this.data = config
        this.data.color = config.color || 'red'
        this.data.fillColor = config.fillColor || 'white'
        this.data.thrust = config.thrust || 0
        this.data.maxThrust = config.maxThrust || 100
        this.data.maxFuel = config.maxFuel || 1000
        this.data.fuel = config.fuel || this.data.maxFuel

        this.data.shootCooldownCurrent = 0
        this.data.shootCooldownDuration = config.shootCooldownDuration || 20

        this.ticksBeenStrandedFor = 0;
    }

    get typeId() { return 'SpaceShip' }

    static negligableSpeed = 0.2
    static MAX_IMPACT_SPEED = 3

    get seemsStill(): boolean {
        const { thrust = 0 } = this.data
        const { momentum } = this
        if (thrust > 0) { return false }
        if (momentum.magnitude > SpaceShip.negligableSpeed) { return false }
        return true
    }

    get seemsStranded(): boolean {
        const { seemsStill } = this;
        const { fuel } = this.data;
        return seemsStill && fuel === 0;
    }

    get isStranded(): boolean {
        return this.ticksBeenStrandedFor > 10
    }

    get landingPadIsRestingOn(): LandingPad | undefined {

        if (!this.seemsStill) { return undefined }
        const landingPads: LandingPad[] = this.world.bodies.filter(body => body instanceof LandingPad).map(body => body as LandingPad);

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
        const { shootCooldownCurrent = 0, thrust = 0, fuel: currentFuel = 1, maxFuel=1 } = this.data;
        const  {landingPadIsRestingOn} = this
        if (shootCooldownCurrent > 0) { this.data.shootCooldownCurrent = shootCooldownCurrent - 1 }

        if (thrust > 0) {
            this.data.fuel = currentFuel - (thrust / 1000);
            if (this.data.fuel <= 0) {
                this.data.fuel = 0;
                this.data.thrust = 0;
            }
        }

        if (this.seemsStranded) { this.ticksBeenStrandedFor++ }
        else { this.ticksBeenStrandedFor = 0 }

        if (landingPadIsRestingOn && landingPadIsRestingOn instanceof RefuelPad) {
            (landingPadIsRestingOn as RefuelPad).refuel(this);
        }
    }

    renderFlame(ctx: CanvasRenderingContext2D, viewPort: ViewPort, leftBoosterCorner: Geometry.Point, rightBoosterCorner: Geometry.Point) {

        const { size = 0, thrust = 0, maxThrust = 0, heading = 0 } = this.data

        let flameStartPoint = {
            x: (leftBoosterCorner.x + rightBoosterCorner.x) / 2,
            y: (leftBoosterCorner.y + rightBoosterCorner.y) / 2,
        }

        let flicker = (Math.random() - .5) * .5
        let leftFlameEndPoint = {
            x: flameStartPoint.x + getVectorX(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker)),
            y: flameStartPoint.y + getVectorY(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker))
        }

        RenderFunctions.renderPolygon.onCanvas(ctx, [leftBoosterCorner, leftFlameEndPoint, rightBoosterCorner], { strokeColor: 'yellow', fillColor: 'red' }, viewPort)

    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { x, y, size = 0, heading = 0, color, fillColor, thrust = 0 } = this.data
        const { shapeValues } = this

        const chasis: Geometry.Wedge = {
            x: x, y: y,
            radius: size,
            heading: heading,
            angle: Geometry._deg * 240,
        }

        const cockpit: Geometry.Wedge = {
            x: x, y: y,
            radius: size * (2 / 3),
            heading: heading,
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

        if (thrust > 0) {
            this.renderFlame(ctx, viewPort, leftBackPoint, leftBackRightPoint);
            this.renderFlame(ctx, viewPort, rightBackPoint, rightBackLeftPoint);
        }
    }

    updateMomentum() {
        Body.prototype.updateMomentum.apply(this, [])
        const { thrust = 0, heading = 0 } = this.data
        const thrustForce = new Force(thrust / this.mass, heading)
        this.momentum = Force.combine([this.momentum, thrustForce])
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

        this.world.emitter.emit('SFX', { soundName: 'shipExploding', source: this });
    }

    handleCollision(report: CollisionDetection.CollisionReport) {

        const { magnitude: impactSpeed } = this.momentum;

        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1

            if (otherThing instanceof Terrain) {

                const elasticityAdjustment = 1 - (otherThing.data.elasticity || 1);
                const adjustedImpactSpeed = impactSpeed * elasticityAdjustment;

                if (adjustedImpactSpeed > SpaceShip.MAX_IMPACT_SPEED) {
                    this.explode({
                        driftBiasX: -this.momentum.vectorX / this.momentum.magnitude * 2,
                        driftBiasY: -this.momentum.vectorY / this.momentum.magnitude * 2
                    })
                }
            }
        }

        Body.prototype.handleCollision(report)
    }


    respondToImpact(report: CollisionDetection.CollisionReport) {
        switch (report.item1.typeId) {
        }
    }

    get steerSpeed() { return .075 }

    shoot() {
        if (!this.world) { return }
        const { shootCooldownCurrent = 0, size = 1, heading = 0 } = this.data

        if (shootCooldownCurrent > 0) { return }
        this.data.shootCooldownCurrent = this.data.shootCooldownDuration

        const bullet = new Bullet({
            x: this.data.x + getVectorX(size + 5, heading),
            y: this.data.y + getVectorY(size + 5, heading),
            color: 'red',
            fillColor: 'red',
            ticksRemaining: 100
        }, new Force(10, heading))

        bullet.enterWorld(this.world)
        this.world.emitter.emit('SFX', { soundName: 'laser', source: this });
    }

    steer(direction: "LEFT" | "RIGHT") {
        const { heading = 0 } = this.data
        switch (direction) {
            case "LEFT":
                this.data.heading = heading + this.steerSpeed;
                break;
            case "RIGHT":
                this.data.heading = heading - this.steerSpeed;
                break;
        }
    }

    changeThrottle(change: number) {
        const { thrust = 0, maxThrust = 0, fuel = 1 } = this.data
        if (fuel <= 0) {
            this.data.thrust = 0
            return
        }
        let newAmount = thrust + change
        if (newAmount < 0) { newAmount = 0 }
        if (newAmount > maxThrust) { newAmount = maxThrust }
        this.data.thrust = newAmount
    }

}

export type { SpaceShipData }
export { SpaceShip }