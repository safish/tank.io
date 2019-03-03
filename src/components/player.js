import {monitor} from '../core'
import Bullet from './bullet'

export default class extends PIXI.Container {
  #bullets = []
  #stamp = 0

  speed = 0
  health = 100
  tag = 'tank'

  constructor({skin, name, id}) {
    super()
    this.id = id
    this.tank = PIXI.Sprite.from(`tank.${skin}.png`)
    this.bar = new PIXI.Graphics()
    this.barMask = new PIXI.Graphics()
    this.name = new PIXI.Text(name, {
      fontSize: 30,
      fontWeight: 'bold',
      fill: 0xffffff
    })
    this.name.y -= 15
    this.name.anchor.set(.5)
    this.tank.anchor.set(.5)
    this.bar
      .beginFill(0xffffff)
      .drawRect(0, 0, 80, 12)
      .endFill()

    this.bar.y += 15
    this.bar.pivot.set(40, 6)
    this.position.set(300, 300)

    this.barMask
      .beginFill(0xffcc33)
      .drawRect(0, 0, 80, 12)
      .endFill()

    // this.barMask.pivot.set(40, 6)
    this.bar.mask = this.barMask

    this.bar.addChild(this.barMask)


    this.addChild(this.tank, this.bar, this.name)

    this
      .addBody({
        fixedRotation: true
      })
      .addBox({
        width: this.width,
        height: this.height
      })
  }

  hurt() {
    this.barMask.x -= 8
    if (this.barMask.x <= -80) {
      this.destroy()
      return
    }
    if (this.barMask.x < -60) {
      this.bar.clear()
      this.bar
        .beginFill(0xff0000)
        .drawRect(0, 0, 80, 12)
        .endFill()
    }
  }

  shoot() {
    const now = Date.now()
    if (now - this.#stamp < 5e2) return
    this.#stamp = now
    const bullet = new Bullet({
      frame: 'bullet.blue.png',
      speed: 12,
      rotation: this.tank.rotation,
      position: this.position
    })
    bullet.tag = this.id
    this.parent.addChild(bullet)
    this.#bullets.push(bullet)
    monitor.emit('sound:shoot')
  }

  run(speed, rotation) {
    this.tank.rotation = rotation === undefined ? this.tank.rotation : rotation - Math.PI / 2
    this.speed = speed

    this.body.setLinearVelocity({
      x: -Math.sin(this.tank.rotation) * this.speed,
      y: Math.cos(this.tank.rotation) * this.speed
    })

    this.body.setAngle(this.tank.rotation)
  }

  operate(code) {
    if (code === 8) this.run(6, -Math.PI)
    if (code === 2) this.run(6, 0)
    if (code === 4) this.run(6, -Math.PI / 2)
    if (code === 0) this.run(0)
    if (code === 1) this.run(6, Math.PI / 2)
    if (code & 16) this.shoot()
  }

  update() {
    const parent = this.parent

    this.#bullets = this.#bullets.filter(bullet => {
      if (bullet.destroyed) {
        return false
      } else if (bullet.x > 0 && bullet.y > 0 &&
        bullet.x < parent.width && bullet.y < parent.height) {
        return true
      } else {
        bullet.destroy()
        return false
      }
    })

    this.tank.rotation = this.body.getAngle()
  }

  destroy() {
    super.destroy({children: true})
    this.body.destroy()
    monitor.emit('sound:lose')
    monitor.emit('player:destroy', this.id)
  }
}