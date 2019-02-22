export default class extends PIXI.Sprite {
  speed = 0

  shadow = new PIXI.Point()

  constructor({body, barrel}) {
    super(PIXI.Texture.from(body))
    this.barrel = PIXI.Sprite.from(barrel)
    this.barrel.anchor.set(.5)
    this.barrel.position.set(0, 20)
    this.text = new PIXI.Text('', {
      fontSize: 40,
      fill: 0xffcc33
    })
    this.anchor.set(.5)
    this.addChild(this.barrel, this.text)
  }

  run(speed, rotation) {
    this.rotation = rotation === undefined ? this.rotation : rotation - Math.PI / 2
    this.speed = speed
  }

  operate(code) {
    // console.log(code)
    if (code === 8) this.run(6, -Math.PI)
    if (code === 2) this.run(6, 0)
    if (code === 4) this.run(6, -Math.PI / 2)
    if (code === 0) this.run(0)
    if (code === 1) this.run(6, Math.PI / 2)
    this.shadow.x -= Math.sin(this.rotation) * this.speed
    this.shadow.y += Math.cos(this.rotation) * this.speed

    // this.x -= Math.sin(this.rotation) * this.speed
    // this.y += Math.cos(this.rotation) * this.speed
  }

  update() {
    this.x -= Math.sin(this.rotation) * this.speed
    this.y += Math.cos(this.rotation) * this.speed
  }

  track() {

    const
      shadow = this.shadow
      // delta = Math.sqrt((shadow.x - this.x) ** 2 + (shadow.y - this.y) ** 2),
      // ratio = delta > 6 ? 6 / delta : 1
    // const delta = (shadow[3] - 90) / 180 * Math.PI - this.rotation
    // console.log(ratio)
    // this.speed = 6 * (1 + delta / 6)

    this.x += (shadow.x - this.x) * .5
    this.y += (shadow.y - this.y) * .5


    // this.rotation += (delta < -Math.PI ? delta + Math.PI * 2 :
      // delta > Math.PI ? delta - Math.PI * 2 : delta) * .2
  }
}