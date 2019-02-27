import {store, network} from './components'
import {prepare, game} from './scenes'
import core, {monitor} from './core'

// prepare().then(() => {
//   game.show()
// })
// fetch('//localhost:9000/join').then(async res => {
//   console.log(await res.text())
// })

network.connect({name: 'client', skin: 0})