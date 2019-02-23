import core, {monitor, Camera} from '../core'
import {Tank, store, Bullet, gamepad} from '../components'

export default {
  tank: {},

  init() {
    this.container = new PIXI.Container()
    this.camera = new Camera()
    this.map = new PIXI.extras.Tilemap({
      map: core.loader.resources.map.data,
      tile: PIXI.Texture.from('tile.png')
    })
    // this.player = this.addTank({
    //   body: 'body.blue.png',
    //   barrel: 'barrel.blue.png'
    // })
    this.camera.set({limitable: true, map: this.map})
    this.camera.addChild(this.map)
    this.container.addChild(this.camera)
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
        id === store.id && this.camera.follow(tank)
        this.camera.addChild(tank)
      }
    }

    for (const id in this.tank) {
      if (store.player[id] === undefined) {
        this.tank[id].destroy({children: true})
        delete this.tank[id]
      } else {
        this.tank[id].update()
      }
    }

    this.camera.update()
  },

  show() {
    this.init()
    this.listen()
    core.stage.addChild(this.container)

  },

  hide() {

  }
}