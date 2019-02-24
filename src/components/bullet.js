export default class extends PIXI.Sprite {

  constructor({frame, rotation, speed}) {
    super(PIXI.Texture.from(frame))
    this.speed = speed
    this.rotation = rotation
    this.anchor.set(.5)
  }

  update() {
    this.x -= Math.sin(this.rotation) * this.speed
    this.y += Math.cos(this.rotation) * this.speed
  }

}