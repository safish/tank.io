const
  http = require('http'),
  {Server, Room} = require('colyseus'),
  server = new Server({server: http.createServer()})

class Playground extends Room {
  onInit() {
    this.maxClients = 2
  }

  onJoin() {

  }

  onLeave() {

  }

  onMessage() {

  }
}

server.register('playground', Playground)
server.listen(9000)




