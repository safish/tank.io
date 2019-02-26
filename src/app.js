import * as colyseus from 'colyseus.js'
import {store} from './components'
import {prepare, game} from './scenes'
import core, {monitor} from './core'

prepare().then(() => {
  game.show()
})
