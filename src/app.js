import * as colyseus from 'colyseus.js'
import {prepare, game} from './scenes'
import core, {monitor} from './core'
import {store} from './components'

const
  client = new colyseus.Client('ws://localhost:9000'),
  room = client.join('playground'),
  data = {}

prepare().then(() => {
  game.show()
})


room.onJoin.add(() => {
  console.log(room.sessionId)
})

room.onStateChange.add(state => {
  Object.assign(store.player, state.player)
  Object.assign(store.bullet, state.bullet)
})

room.listen('bullet/:id', ctx => {
  if (ctx.operation === 'remove') {
    delete store.bullet[ctx.path.id]
  }
})

room.listen('player/:id', ctx => {
  if (ctx.operation === 'remove') {
    delete store.player[ctx.path.id]
  }
})

window.addEventListener('keydown', ev => {
  let r

  data.v = 5
  switch (ev.keyCode) {
    case 37: {
      r = 180
      break
    }
    case 38: {
      r = -90
      break
    }
    case 39: {
      r = 0
      break
    }
    case 40: {
      r = 90
      break
    }
    case 32: {
      room.send({shoot: true})
      break
    }
    default: {
      console.log(ev.keyCode)
      break
    }
  }

  if (data.r !== r) {
    data.r = r
    room.send(data)
  }

})

window.addEventListener('keyup', ev => {
  data.r = null
  room.send({v: 0})
})