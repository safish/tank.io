import * as colyseus from 'colyseus.js'
import {prepare, game} from './scenes'
import core, {monitor} from './core'
import {store} from './components'

prepare().then(() => {
  game.show()

const
  client = new colyseus.Client('ws://172.16.48.242:9000'),
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


client.onOpen.add(err => {
  const room = client.join('playground')

  room.onJoin.add(() => {
    console.log(room.sessionId)
  })

  room.onLeave.add(() => {
    delete store.player[room.sessionId]
  })

  room.onMessage.add(data => {
    if (data.type === 'sync') {
      store.joined = true
      store.index = 0
      store.frames = data.frames
      /* 填充空帧 */
      for (let i = 0, last; i < store.frames.length; i++) {
        last = store.frames[i] || last
        store.frames[i] = last
      }
    } else {
      const [index, frame] = data
      store.frames[index] = frame
      for (let i = 1; i < 3; i++) {
        const j = index - i
        store.frames[j] = store.frames[j] || frame
      }
    }
    // console.log(store.frames)
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

core.ticker.add(() => {
  if (!store.joined) return
  while (store.frames.length - store.index > 15) step()
  step()
})

function step() {
  const frame = store.frames[store.index]
  if (frame) {
    store.index++

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
