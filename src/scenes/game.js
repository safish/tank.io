import core, {monitor, Camera, engine} from '../core'
import {Player, store, Bullet, gamepad} from '../components'

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

    monitor
      .on('player:destroy', id => {
        if (id === store.id) {
          this.camera.follow(null)
        }
        delete this.player[id]
      })
  },

  addPlayer(id, opt) {
    const
      {name, skin} = opt,
      player = new Player({name, skin, id})

    this.player[id] = player
    id === store.id && this.camera.follow(player)
    this.camera.addChild(player)
    return player
  },

  removePlayer(id) {
    this.player[id] && this.player[id].destroy()
    delete this.player[id]
  },

  /* 步进 */
  step(piece) {
    switch (piece[0]) {
      case 'join': {
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
        for (const id in data) {
          const player = this.player[id]
          player && player.operate(data[id])
        }
        break
      }
    }
  },

  tick() {
    engine.tick()
  },

  update() {
    this.camera.update()
    for (const id in this.player) this.player[id].update()
  },

  show() {
    this.init()
    this.listen()
    core.stage.addChild(this.container)
    core.ticker.add(this.update.bind(this))
  },

  hide() {

  }
}