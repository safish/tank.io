export default class extends PIXI.Sprite {
  constructor(frame) {
    super(PIXI.Texture.from(frame))
    this.anchor.set(.5)
  }

  track(shadow) {
    this.rotation = (shadow[2] - 90) / 180 * Math.PI
    this.x += (shadow[0] - this.x) * .2
    this.y += (shadow[1] - this.y) * .2
    this.x -= Math.sin(this.rotation) * 16
    this.y += Math.cos(this.rotation) * 16
  }
}