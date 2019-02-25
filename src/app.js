import * as colyseus from 'colyseus.js'
import {store} from './components'
import {prepare, game} from './scenes'
import core, {monitor} from './core'

// prepare().then(() => {
//   game.show()
// })
prepare().then(() => {
  game.show()

const
  client = new colyseus.Client('ws://192.168.0.106:9000'),
  key = new Proxy(
    {
      32: 0,
      37: 0,
      38: 0,
      39: 0,
      40: 0
    },
    {
      set(target, key, value) {
        if (target[key] !== value && target[key] !== undefined) {
          target[key] = value
          monitor.emit('action:update')
        }
        return true
      }
    }
  )

let delta, last = performance.now()

client.onOpen.add(err => {
  const room = client.join('playground')

  room.onJoin.add(() => {
    store.id = room.sessionId
  })

  room.onMessage.add(data => {
    switch (data.type) {
      case 'sync': {
        store.joined = true
        store.index = 0
        store.frames = data.frames
        /* 填充空帧 */
        for (let i = 0, last; i < store.frames.length; i++) {
          last = store.frames[i] || last
          store.frames[i] = last
        }
        console.log('sync', store.frames)
        break
      }

      case 'leave': {
        delete store.player[data.id]
        for (let i = 0; i < store.frames.length; i++) {
          const frame = store.frames[i]
          frame && (store.frames[i] = frame.filter(item => item[0] !== data.id))
        }
        break
      }

      default: {
        console.log('step')
        store.frames.push(data, data, data)
        break
      }
    }
  })

  monitor.on('action:update', () => {
    const s = `${key[32]}${key[37]}${key[38]}${key[39]}${key[40]}`
    room.send(parseInt(s, 2))
  })
})

client.onError.add(() => {
  console.log('error')
})

client.onClose.add(err => {
  console.log('close')
})

window.addEventListener('keydown', ev => {
  key[ev.keyCode] = 1
})

window.addEventListener('keyup', ev => {
  key[ev.keyCode] = 0
})

const node = document.querySelector('i')

setInterval(() => {
  node.innerText = `${store.frames.length} ${delta}`
}, 1e3)

core.ticker.add(() => {
  if (!store.joined) return
  step()
  while (store.frames.length > 3) step()
})

function step() {
  const frame = store.frames.shift()
  if (frame) {
    // store.index++
    frame.forEach(item => {
      store.player[item[0]] = item[1]
      game.tank[item[0]] && game.tank[item[0]].operate(item[1])
    })
    // console.log(frame)
    game.update()
  }
}

})

// console.log('test')
