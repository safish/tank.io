const
  http = require('http'),
  {Server, Room} = require('colyseus'),
  server = new Server({server: http.createServer()})

class Playground extends Room {
  onInit() {
    this.maxClients = 2
    this.setState({
      player: {},
      frames: []
    })
  }

  onJoin(client) {

  }

  onLeave() {

  }

  onMessage(client, data) {
    console.log(data)
  }
}

server.register('playground', Playground)
server.listen(9000)




