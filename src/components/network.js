import * as colyseus from 'colyseus.js'

const client = new colyseus.Client('ws://192.168.0.106:9000')

function join({name, skin}) {
  const room = client.join('playground', {name, skin})
  room.onJoin.add(() => {

  })

  room.onLeave.add(() => {

  })

  room.onMessage.add(() => {

  })
}



export {
  join
}