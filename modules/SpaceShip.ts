import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing } from 'physics-worlds'
import { Bullet } from './Bullet'
import { DustCloud } from './DustCloud'

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
    }

    get typeId() { return 'SpaceShip' }

    tick() {
        const { shootCooldownCurrent = 0, thrust = 0, fuel: currentFuel = 1 } = this.data;
        if (shootCooldownCurrent > 0) { this.data.shootCooldownCurrent = shootCooldownCurrent - 1 }

        if (thrust > 0) {
            this.data.fuel = currentFuel - (thrust / 1000);
            if (this.data.fuel <= 0) {
                this.data.fuel = 0;
                this.data.thrust = 0;
            }
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { x, y, size = 0, heading = 0, color, fillColor, thrust = 0, maxThrust = 0 } = this.data
        const { shapeValues } = this

        const frontPoint = translatePoint(shapeValues, getXYVector(size, heading))
        const midPoint = translatePoint(shapeValues, getXYVector(size * (4 / 6), heading))

        const backSideAngle = Math.PI * .75
        const backLeftPoint = translatePoint(shapeValues, getXYVector(size, heading - backSideAngle))
        const backRightPoint = translatePoint(shapeValues, getXYVector(size, heading + backSideAngle))

        const cockpit: Geometry.Wedge = {
            x: midPoint.x, y: midPoint.y,
            radius: size * (2 / 3),
            heading: reverseHeading(heading),
            angle: backSideAngle * (2 / 6)
        }

        RenderFunctions.renderPolygon.onCanvas(ctx, [frontPoint, backLeftPoint, backRightPoint], { strokeColor: color, fillColor }, viewPort)
        RenderFunctions.renderWedge.onCanvas(ctx, cockpit, { fillColor: color, lineWidth: 1 / 2 }, viewPort);

        if (thrust > 0) {
            let backPoint = {
                x: x - getVectorX(size, heading),
                y: y - getVectorY(size, heading)
            }

            let flicker = (Math.random() - .5) * .5
            let flameEndPoint = {
                x: backPoint.x + getVectorX(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker)),
                y: backPoint.y + getVectorY(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker))
            }

            RenderFunctions.renderPolygon.onCanvas(ctx, [backRightPoint, flameEndPoint, backLeftPoint], { strokeColor: 'blue', fillColor: 'green' }, viewPort)
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
            driftSpeed: 2,
            driftBiasX,
            driftBiasY,
            colors: ['white', color, color]
        }).enterWorld(this.world)

        this.world.emitter.emit('SFX', { soundName: 'shipExploding', source: this });
    }

    handleCollision(report: CollisionDetection.CollisionReport) {

        const { maxImpact = 0 } = this.data

        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1

            const forceThatCounts = otherThing.data.immobile ? report.force
                : report.item1 === this
                    ? report.force2
                    : report.force;

            if (forceThatCounts > maxImpact) {
                this.explode()
            }
        }

        Body.prototype.handleCollision(report)
    }


    respondToImpact(report: CollisionDetection.CollisionReport) {

        switch (report.item1.typeId) {
            case 'Rock':
                const drift = Geometry.getXYVector(1, report.item1.momentum.direction);
                this.explode({ driftBiasX: drift.x, driftBiasY: drift.y })
                this.world.emitter.emit('shipDeath', this)
                break;
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

export { SpaceShip }