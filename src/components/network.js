import * as colyseus from 'colyseus.js'

const client = new colyseus.Client('ws://172.16.48.242:9000')

let room

function connect({name, skin}) {
  room = client.join('playground', {name, skin})
}

export {
  connect
}