import * as colyseus from 'colyseus.js'
import {prepare, game} from './scenes'
import core, {monitor} from './core'
import {store} from './components'


prepare().then(() => {
  game.show()
})