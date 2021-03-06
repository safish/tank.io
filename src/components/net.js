import * as colyseus from 'colyseus.js'
import store from './store'
import {monitor} from '../core'



function join({name, skin}) {
  const
    client = new colyseus.Client('ws://192.168.0.106:9000'),
    room = client.join('playground', {name, skin})

  client.onError.add(err => {
    const index = err.indexOf('Failed to auto-create')
    if (index !== -1) monitor.emit('game:rename')
  })

  room.onJoin.add(() => {
    store.id = room.sessionId
    monitor.emit('game:join')
    monitor.on('action:update', key => {
      const s = `${key[32]}${key[37]}${key[38]}${key[39]}${key[40]}`
      room.send(parseInt(s, 2))
    })
  })

  room.onMessage.add(data => {
    switch (data[0]) {
      case 'sync': {
        store.frames = data[1]
        /* 填充空帧 */
        for (let i = 0, last; i < store.frames.length; i++) {
          last = store.frames[i] || last
          store.frames[i] = last
        }
        break
      }

      case 'update': {
        store.frames.push(data[1], data[1], data[1])
        break
      }
    }
  })
}



export {
  join
}