import Bullet from './bullet'
import store from './store'

export default class extends PIXI.Sprite {
  #bullets = []
  #stamp = 0

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

  shoot() {
    const now = Date.now()
    if (now - this.#stamp < 5e2) return
    this.#stamp = now
    const bullet = new Bullet({
      frame: 'bullet.blue.png',
      speed: 12,
      rotation: this.rotation
    })
    bullet.position.copy(this.position)
    this.parent.addChild(bullet)
    this.#bullets.push(bullet)
  }

  run(speed, rotation) {
    this.rotation = rotation === undefined ? this.rotation : rotation - Math.PI / 2
    this.speed = speed
  }

  operate(code) {
    if (code === 8) this.run(6, -Math.PI)
    if (code === 2) this.run(6, 0)
    if (code === 4) this.run(6, -Math.PI / 2)
    if (code === 0) this.run(0)
    if (code === 1) this.run(6, Math.PI / 2)
    if (code & 16) this.shoot()


    this.x -= Math.sin(this.rotation) * this.speed
    this.y += Math.cos(this.rotation) * this.speed
  }

  update() {
    const
      bullets = this.#bullets


    // this.x += (shadow.x - this.x) * .3 * ratio
    // this.y += (shadow.y - this.y) * .3 * ratio

    bullets.forEach(bullet => {
      bullet.update()
    })
  }
}