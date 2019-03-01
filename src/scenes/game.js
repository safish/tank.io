import core, {monitor, Camera, engine} from '../core'
import {Tank, store, Bullet, gamepad} from '../components'

export default {
  player: {},

  init() {
    this.container = new PIXI.Container()
    this.camera = new Camera()
    this.map = new PIXI.extras.Tilemap({
      map: core.loader.resources.map.data,
      tile: PIXI.Texture.from('tile.png')
    })


    this.camera.set({limitable: true, map: this.map})
    this.camera.addChild(this.map)
    this.container.addChild(this.camera)
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

  addPlayer(id, opt) {
    const
      {name, skin} = opt,
      tank = new Tank({
        body: 'body.blue.png',
        barrel: 'barrel.blue.png'
      })

    this.player[id] = tank
    id === store.id && this.camera.follow(tank)
    this.camera.addChild(tank)
    return tank
  },

  removePlayer(id) {
    this.player[id].destroy({children: true})
    delete this.player[id]
  },

  /* 步进 */
  tick(piece) {
    switch (piece[0]) {
      case 'join': {
        // console.log('join', piece[1])
        !this.player[piece[1]] &&
        this.addPlayer(piece[1], piece[2])
        break
      }

      case 'leave': {
        this.removePlayer(piece[1])
        break
      }

      case 'update': {
        const data = piece[1]
        console.log(data)
        for (const id in data) {
          const player = this.player[id]
          player && player.operate(data[id])
        }
        break
      }
    }
    engine.update()

  },

  update() {

  },

  show() {
    this.init()
    this.listen()
    core.stage.addChild(this.container)
    // core.ticker.add(this.update.bind(this))
  },

  hide() {

  }
}