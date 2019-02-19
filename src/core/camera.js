import core from './core'

export default class Camera extends PIXI.Container {
  target = null
  limitable = true
  offset = new PIXI.Point()
  goal = new PIXI.Point()

  constructor() {
    super()
  }

  follow(target) {
    this.target = target
  }

  set({limitable, map}={}) {
    limitable !== undefined ? this.limitable = limitable : 0
    map !== undefined ? this.map = map : 0
  }

  focus(t) {
    const
      x = core.screen.width * .5 + this.offset.x,
      y = core.screen.height * .5 + this.offset.y,
      damping = 1 - Math.exp(-t / 10)

    this.target.getGlobalPosition(this.goal)
    this.goal.x = x - this.goal.x
    this.goal.y = y - this.goal.y

    this.x += this.goal.x
    this.y += this.goal.y
  }

  update(t) {
    this.target && this.focus(t)

    /* 限制可视区域 */
    if (this.limitable && this.map) {
      let delta = core.screen.width - this.map.width
      this.x > 0 ? this.x = 0 : delta < 0 && this.x < delta ? this.x = delta : 0
      delta= core.screen.height - this.map.height
      this.y > 0 ? this.y = 0 : delta < 0 && this.y < delta ? this.y = delta : 0
    }
  }
}
