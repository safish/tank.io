import {store, network} from './components'
import {prepare, game} from './scenes'
import core, {monitor} from './core'

prepare().then(() => {
  game.show()
})

EventTarget.prototype.on = function(...args) {
  this.addEventListener(...args)
  return this
}


window.on = (...args) => {
  window.addEventListener(...args)
  return window
}

document.on('touchstart', () => {
  // network.join({name: 'test', skin: 'blue'})
  // console.log('test')
})

let i = 0
core.ticker.add(() => {
  i++
  i %= 0xffff
  if (!(i % 3)) return
  tick()
  while (store.frames.length > 3) tick()
})


function tick() {
  const
    frame = store.frames.shift(),
    step = game.step.bind(game)

  if (frame && frame.length) {
    frame.forEach(step)
    game.tick()
  }
}

const key = new Proxy(
  {32: 0, 37: 0, 38: 0, 39: 0, 40: 0},
  {
    set(target, key, value) {
      if (target[key] !== value && target[key] !== undefined) {
        target[key] = value
        monitor.emit('action:update', target)
      }
      return true
    }
  }
)

window
  .on('keydown', ev => {
    key[ev.keyCode] = 1
  })
  .on('keyup', ev => {
    key[ev.keyCode] = 0
  })