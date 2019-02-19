export default class extends PIXI.Sprite {
  speed = 0

  constructor({body, barrel}) {
    super(PIXI.Texture.from(body))
    this.barrel = PIXI.Sprite.from(barrel)
    this.barrel.anchor.set(.5)
    this.barrel.position.set(0, 20)
    this.anchor.set(.5)
    this.addChild(this.barrel)
  }

  run(speed, rotation) {
    this.rotation = rotation === undefined ? this.rotation : rotation - Math.PI / 2
    this.speed = speed
  }

  update() {
    this.x -= Math.sin(this.rotation) * this.speed
    this.y += Math.cos(this.rotation) * this.speed
  }

  track(shadow) {
    const delta = (shadow[3] - 90) / 180 * Math.PI - this.rotation
    this.x += (shadow[0] - this.x) * .2
    this.y += (shadow[1] - this.y) * .2
    this.rotation += (delta < -Math.PI ? delta + Math.PI * 2 :
      delta > Math.PI ? delta - Math.PI * 2 : delta) * .2
  }
}