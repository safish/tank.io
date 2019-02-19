import core, {monitor} from '../core'
import {Tank, store, Bullet, gamepad} from '../components'

export default {
  tanks: [],
  player: null,

  init() {
    this.container = new PIXI.Container()
    this.player = this.addTank({
      body: 'body.blue.png',
      barrel: 'barrel.blue.png'
    })
    this.container.addChild(gamepad)
  },

  addTank({body, barrel}) {
    const tank = new Tank({body, barrel})
    this.tanks.push(tank)
    this.container.addChild(tank)
    return tank
  },

  listen() {
    gamepad
      .on('trackball:move', rotation => {
        this.player.run(6, rotation)
      })
      .on('trackball:stop', () => {
        this.player.run(0)
      })
  },

  update() {
    this.tanks.forEach(tank => {
      tank.update()
    })
  },

  show() {
    this.init()
    this.listen()
    core.ticker.add(this.update.bind(this))
    core.stage.addChild(this.container)
  },

  hide() {

  }
}