import * as colyseus from 'colyseus.js'
import {prepare, game} from './scenes'
import core, {monitor} from './core'
import {store} from './components'

const
  client = new colyseus.Client('ws://localhost:9000'),
  key = {}


client.onOpen.add(err => {
  const room = client.join('playground')

  room.onJoin.add(() => {

  })

  room.onStateChange.add((...args) => {
    console.log(...args)
  })

  room.onLeave.add(() => {

  })
})

client.onError.add(() => {
  console.log('error')
})

client.onClose.add(err => {
  console.log('close')
})

window.addEventListener('keydown', ev => {
  switch (ev.keyCode) {
    case 37:
    case 38:
    case 39:
    case 40:
    case 32: {
      key[ev.keyCode] = 1
      break
    }
  }
})

window.addEventListener('keyup', ev => {
  switch (ev.keyCode) {
    case 37:
    case 38:
    case 39:
    case 40:
    case 32: {
      key[ev.keyCode] = 0
      break
    }
  }

  console.log(key)
})

