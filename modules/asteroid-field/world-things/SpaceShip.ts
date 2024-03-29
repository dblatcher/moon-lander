import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing, SoundControl } from 'physics-worlds'
import { Bullet } from './Bullet'
import { DustCloud } from './DustCloud'

const { getVectorX, getVectorY, reverseHeading, getXYVector, translatePoint } = Geometry

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

    shootCooldownDuration?: number
    shootCooldownCurrent?: number
    instanceId?: string
    boostersOn?: boolean
}

class SpaceShip extends Body {
    data: SpaceShipData
    thrustNoise?: SoundControl | null

    constructor(config: SpaceShipData, momentum: Force = Force.none) {
        super(config, momentum);
        this.data = config
        this.data.color = config.color || 'red'
        this.data.fillColor = config.fillColor || 'white'
        this.data.thrust = config.thrust || 0
        this.data.maxThrust = config.maxThrust || 100
        this.data.shootCooldownCurrent = 0
        this.data.shootCooldownDuration = config.shootCooldownDuration || 20
        this.data.boostersOn = config.boostersOn || false
    }

    get typeId() { return 'SpaceShip' }
    static PLAYER_INSTANCE_ID = 'player'
    get isPlayer() {
        return this.data.instanceId === SpaceShip.PLAYER_INSTANCE_ID;
    }

    tick() {
        const { boostersOn, maxThrust = 100, thrust = 0 } = this.data

        if (this.data.shootCooldownCurrent && this.data.shootCooldownCurrent > 0) { this.data.shootCooldownCurrent-- }

        if (this.isPlayer && this.world.soundDeck && !this.thrustNoise) {
            this.thrustNoise = this.world.soundDeck.playNoise({ frequency: 50, duration: 3 }, { loop: true, volume: 0 })
        }
        if (this.thrustNoise) {
            this.thrustNoise.volume = thrust > 0 ? .5 + (1.5 * thrust / maxThrust) : 0
        }

        const throttleRate = maxThrust * .1
        if (boostersOn) {
            this.changeThrottle(throttleRate)
        } else if (thrust > 0) {
            this.changeThrottle(-throttleRate)
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { x, y, size = 1, heading = 0, color, fillColor, thrust = 0, maxThrust = 0 } = this.data
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
        const { size = 1, color = 'red' } = this.data
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

        this.world.soundDeck?.playSample('die')
    }

    handleCollision(report: CollisionDetection.CollisionReport) {

        switch (report.item2.typeId) {
            case 'Rock':
                const drift = Geometry.getXYVector(-1, this.momentum.direction);
                this.explode({ driftBiasX: drift.x, driftBiasY: drift.y })
                this.world.emitter.emit('shipDeath', this)
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
        const { shootCooldownCurrent = 0, shootCooldownDuration = 20, size = 1, heading = 0 } = this.data

        if (shootCooldownCurrent > 0) { return }
        this.data.shootCooldownCurrent = shootCooldownDuration

        const bullet = new Bullet({
            x: this.data.x + getVectorX(size + 10, heading),
            y: this.data.y + getVectorY(size + 10, heading),
            color: 'red',
            fillColor: 'red',
            size: 4,
            ticksRemaining: 100
        }, new Force(20, heading))

        bullet.enterWorld(this.world)
        this.world.soundDeck?.playSample('laser')
    }

    steer(direction: "LEFT" | "RIGHT") {
        switch (direction) {
            case "LEFT":
                this.data.heading = (this.data.heading || 0) + this.steerSpeed;
                break;
            case "RIGHT":
                this.data.heading = (this.data.heading || 0) - this.steerSpeed;
                break;
        }
    }

    setBoosters(isOn: boolean) {
        this.data.boostersOn = isOn
    }

    changeThrottle(change: number) {
        const { thrust = 0, maxThrust = 10 } = this.data
        let newAmount = thrust + change
        if (newAmount < 0) { newAmount = 0 }
        if (newAmount > maxThrust) { newAmount = maxThrust }
        this.data.thrust = newAmount
    }

    leaveWorld(): void {
        Body.prototype.leaveWorld.apply(this, [])
        this.thrustNoise?.stop()
    }
}

export type { SpaceShipData }
export { SpaceShip }