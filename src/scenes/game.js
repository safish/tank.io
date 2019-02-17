import core, {monitor} from '../core'
import {Player, store, Bullet} from '../components'

export default {
  down: false,
  player: {},
  bullet: {},

  init() {
    this.container = new PIXI.Container()
  },

  listen() {
  },

  update() {
    for (const id in store.player) {
      const
        player = this.player[id] || new Player({
          body: 'body.blue.png',
          barrel: 'barrel.blue.png'
        }),
        shadow = store.player[id]
      if (!player.parent) {
        this.player[id] = player
        this.container.addChild(player)
      }
      player.track(shadow)
    }

    for (const id in store.bullet) {
      const
        bullet = this.bullet[id] || new Bullet('bullet.blue.png'),
        shadow = store.bullet[id]
      if (!bullet.parent) {
        this.bullet[id] = bullet
        bullet.position.set(shadow[0], shadow[1])
        this.container.addChild(bullet)
      }
      bullet.track(shadow)
    }

    for (const id in this.bullet) {
      if (!store.bullet[id]) {
        const bullet = this.bullet[id]
        delete this.bullet[id]
        bullet.destroy()
      }
    }

    for (const id in this.player) {
      if (!store.player[id]) {
        const player = this.player[id]
        delete this.player[id]
        player.destroy()
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