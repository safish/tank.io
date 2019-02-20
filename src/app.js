import * as colyseus from 'colyseus.js'
import {prepare, game} from './scenes'
import core, {monitor} from './core'
import {store} from './components'

const
  client = new colyseus.Client('ws://127.0.0.1:9000'),
  room = client.join('playground')


room
  .onJoin.add(() => {
    console.log(`sessionId: ${room.sessionId}\nroomId: ${room.id}`)
  })

// prepare().then(() => {
//   game.show()
// })

