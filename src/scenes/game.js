import core, {monitor} from '../core'
import {Tank, store, Bullet, gamepad} from '../components'

export default {
  tank: {},

  init() {
    this.container = new PIXI.Container()
    // this.player = this.addTank({
    //   body: 'body.blue.png',
    //   barrel: 'barrel.blue.png'
    // })
    // this.container.addChild(gamepad)
  },

  addTank({body, barrel}) {
    const tank = new Tank({body, barrel})
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
    for (const id in store.player) {
      const tank = this.tank[id] || new Tank({
        body: 'body.blue.png',
        barrel: 'barrel.blue.png'
      })

      if (!tank.parent) {
        this.tank[id] = tank
        this.container.addChild(tank)
      }

      // tank.operate(store.player[id])
    }

    for (const id in this.tank) {
      if (store.player[id] === undefined) {
        this.tank[id].destroy({children: true})
        delete this.tank[id]
      } else {
        this.tank[id].track()
      }
    }
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