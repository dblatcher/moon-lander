import { Body, Force, Geometry, BodyData, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing } from 'physics-worlds'
import { DustCloud } from './DustCloud'

const { translatePoint, _360deg } = Geometry

type Crater = {
    radius: number,
    distance: number,
    heading: number
}

class Rock extends Body {

    jaggedEdgeShape: Force[]
    craters: Crater[]
    rotation: number

    constructor(config: BodyData, momentum: Force = Force.none) {
        super(config, momentum)
        this.jaggedEdgeShape = Rock.makeJaggedEdgeShape(config)
        this.rotation = (.02 + Math.random() * .01) * (Math.random() > .5 ? 1 : -1)
        this.craters = Rock.makeCraters(config)
    }

    get typeId() { return 'Rock' }

    get jaggedEdgePoints(): Geometry.Point[] {
        const { heading = 0 } = this.data
        return this.jaggedEdgeShape.map(force => {
            return {
                x: this.data.x + Geometry.getVectorX(force.magnitude, force.direction + heading),
                y: this.data.y + Geometry.getVectorY(force.magnitude, force.direction + heading),
            }
        })
    }

    renderCrater(crater: Crater, ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        const { x, y, heading: rockHeading = 0, color } = this.data
        const { radius, distance, heading } = crater


        RenderFunctions.renderCircle.onCanvas(ctx, {
            ...translatePoint({ x, y }, new Force(distance, rockHeading + heading).vector),
            radius,
        }, { strokeColor: 'black', fillColor: color }, viewPort)
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        RenderFunctions.renderPolygon.onCanvas(ctx, this.jaggedEdgePoints, { strokeColor: this.data.color, fillColor: this.data.fillColor }, viewPort)

        this.craters.forEach(crater => {
            this.renderCrater(crater, ctx, viewPort)

        })
    }

    tick() {
        this.data.heading = (this.data.heading || 0) + this.rotation
    }

    shatter(report: CollisionDetection.CollisionReport | null = null) {
        if (this.data.size && this.data.size > 30) {

            let impactDirection = Math.random() * 2 * Math.PI
            if (report) {
                let otherThing = report.item1 == this ? report.item2 : report.item1
                impactDirection = otherThing.momentum.direction
            }

            const makeFragment = (data: BodyData, splitDirection: number, divider = 2): Rock => {
                const { size = 1 } = this.data
                const newRockConfig = Object.assign({}, data, {
                    size: size / divider,
                    x: data.x + Geometry.getVectorX(size / 2, splitDirection),
                    y: data.y + Geometry.getVectorY(size / 2, splitDirection),
                })

                return new Rock(newRockConfig, new Force(6, splitDirection))
            }

            if (this.data.size >= 100) {
                makeFragment(this.data, impactDirection + 0 * Geometry._deg, 3).enterWorld(this.world)
                makeFragment(this.data, impactDirection + 120 * Geometry._deg, 3).enterWorld(this.world)
                makeFragment(this.data, impactDirection - 120 * Geometry._deg, 3).enterWorld(this.world)
            } else {
                makeFragment(this.data, impactDirection + Geometry._90deg).enterWorld(this.world)
                makeFragment(this.data, impactDirection - Geometry._90deg).enterWorld(this.world)
            }

            new ExpandingRing({
                x: report ? report.impactPoint.x : this.data.x,
                y: report ? report.impactPoint.y : this.data.y,
                duration: 20 + Math.floor(this.data.size / 10),
                size: this.data.size / 2,
                color: 'white',
            }).enterWorld(this.world)

            const driftBias = Geometry.getXYVector(1, impactDirection + Geometry._90deg)

            new DustCloud({
                size: 10,
                numberOfSpecs: this.data.size / 2,
                x: this.data.x,
                y: this.data.y,
                driftBiasX: driftBias.x,
                driftBiasY: driftBias.y,
                duration: 40,
                driftSpeed: 1,
                colors: [this.data.color || 'gray', 'white'],
            }).enterWorld(this.world)

            new DustCloud({
                size: 10,
                numberOfSpecs: this.data.size / 2,
                x: this.data.x,
                y: this.data.y,
                driftBiasX: -driftBias.x,
                driftBiasY: -driftBias.y,
                duration: 40,
                driftSpeed: 1,
                colors: [this.data.color || 'gray', 'white'],
            }).enterWorld(this.world);

            this.world.soundDeck?.playSample('bang')
            this.world.emitter.emit('add-points', 25)
        } else {

            new DustCloud({
                size: 10,
                numberOfSpecs: 20,
                x: this.data.x,
                y: this.data.y,
                duration: 50,
                colors: ['red', 'blue', 'pink']
            }).enterWorld(this.world);
            this.world.soundDeck?.playSample('crumble')
            this.world.emitter.emit('add-points', 50)
        }

        this.leaveWorld()
    }

    handleCollision(report: CollisionDetection.CollisionReport) {

        switch (report.item2.typeId) {
            case 'Bullet':
                this.shatter(report)
                this.world.emitter.emit('rockHit', this)
                break;

            case 'Rock':
                this.world.soundDeck?.playSample('bang', { volume: .25 })
        }

        Body.prototype.handleCollision(report)
    }

    respondToImpact(report: CollisionDetection.CollisionReport) {

        switch (report.item1.typeId) {
            case 'Bullet':
                this.shatter(report)
                this.world.emitter.emit('rockHit', this)
                break;
        }
    }

    static makeJaggedEdgeShape(config: BodyData): Force[] {
        const { size = 1 } = config
        const numberOfCorners = 9 + Math.floor(Math.random() * 3)
        const cornerSegment = (Math.PI * 2) / numberOfCorners
        const corners: Force[] = []
        let i, angleVariance, radiusVariance

        for (i = 0; i < numberOfCorners; i++) {
            angleVariance = (Math.random() - .5) * (2 / 3)
            radiusVariance = (Math.random() * size) * (2 / 14)
            corners.push(new Force(size - radiusVariance, (cornerSegment * i) + angleVariance))
        }
        return corners
    }

    static makeCraters(config: BodyData): Crater[] {
        const { size = 1 } = config
        const craters: Crater[] = []
        const numberOfCrater = size < 30 ? 0 : Math.floor(size / 8 * (Math.random() / 5 + .75))

        for (let i = 0; i < numberOfCrater; i++) {
            const radius = Math.floor(Math.random() * 10) + 3
            const maxDistance = size - radius - 2
            craters.push({
                radius,
                heading: Math.random() * _360deg,
                distance: Math.floor(Math.random() * maxDistance)
            })
        }

        return craters
    }
}

export { Rock }