/* 游戏手柄 */
import core, {zoom, design} from '../core'
import {tween} from 'popmotion'

const
  {screen} = core,
  gamepad = new PIXI.Container(),
  area = new PIXI.Graphics(),
  trackball = new PIXI.Graphics(),
  key = {
    a: new PIXI.Graphics()
  }


area
  .beginFill(0xffffff, .3)
  .drawCircle(0, 0, 180)
  .endFill()

trackball
  .lineStyle(4, 0xffffff)
  .beginFill(0x00bcd4, .8)
  .drawCircle(0, 0, 100)
  .endFill()

key.a
  .beginFill(0xffcc33)
  .drawCircle(0, 0, 80)
  .endFill()

key.a.addChild(new PIXI.Text('A', {
  fill: 0xffffff,
  fontSize: 40,
  fontWeight: 600
})).anchor.set(.5)

key.a.interactive = true
key.a.on('pointerdown', () => {
  gamepad.emit('key:a:down')
  if (key.a.frozen) return
  key.a.frozen = true
  tween({
    from: 1,
    to: 1.2,
    duration: 1e2,
    yoyo: 1
  }).start({
    update: v => key.a.scale.set(v),
    complete: () => key.a.frozen = false
  })
})

area.interactive = true
area
  .on('pointerdown', ev => {
    area.down = true
    area.touchId = ev.data.identifier
    if (trackball.action) {
      trackball.frozen = false
      trackball.action.stop()
    }
    trackball.position.copy(area.toLocal(ev.data.global))
    limit()
  })
  .on('pointermove', ev => {
    if (!area.down || ev.data.identifier !== area.touchId) return
    area.toLocal(ev.data.global, null, trackball.position)
    limit()
  })
  .on('pointerup', up)
  .on('pointerupoutside', up)


function up() {
  area.down = false
  gamepad.emit('trackball:stop')
  if (trackball.frozen) return
  trackball.frozen = true
  trackball.action = tween({
    from: {x: trackball.x, y: trackball.y},
    to: {x: 0, y: 0},
    duration: 2e2
  }).start({
    update: v => trackball.position.copy(v),
    complete: () => trackball.frozen = false
  })
}

function limit() {
  const
    position = trackball.position,
    rotation = Math.atan2(position.y, position.x),
    r = Math.sqrt(position.x ** 2 + position.y ** 2) - 140

  if (r > 0) {
    position.x -= Math.cos(rotation) * r
    position.y -= Math.sin(rotation) * r
  }

  gamepad.emit('trackball:move', rotation)
}

gamepad.on('added', () => {
  core.align(area, {left: 80, bottom: 80})
  core.align(key.a, {right: 150, bottom: 180})
})

area.addChild(trackball)
gamepad.scale.set(zoom.min)
gamepad.addChild(area, ...Object.values(key))


export default gamepad
