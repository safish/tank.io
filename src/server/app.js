const
  http = require('http'),
  {Server, Room} = require('colyseus'),
  server = new Server({server: http.createServer()})

let id = 0

class State {
  constructor() {
    this.player = {}
    this.bullet = {}
  }

  add(client) {
    this.player[client.sessionId] = [0, 0, 0, 0]
  }

  shoot(client) {
    const player = this.player[client.sessionId]
    this.bullet[id++] = [player[0], player[1], player[3], client.sessionId]
  }
}

class GameRoom extends Room {
  onInit() {
    this.maxClients = 6
    this.setState(new State())
    this.setPatchRate(50)
    this.setSimulationInterval(this.update.bind(this))
  }

  onJoin(client) {
    this.state.add(client)
  }

  onLeave(client) {
    delete this.state.player[client.sessionId]
  }

  update() {
    const player = this.state.player
    for (const id in player) {
      const role = player[id]
      if (!role[2]) continue
      role[0] += Math.cos(role[3] / 180 * Math.PI) * role[2]
      role[1] += Math.sin(role[3] / 180 * Math.PI) * role[2]
      role[0] = ~~role[0]
      role[1] = ~~role[1]
    }

    const bullet = this.state.bullet
    for (const id in bullet) {
      const item = bullet[id]
      item[0] += Math.cos(item[2] / 180 * Math.PI) * 16
      item[1] += Math.sin(item[2] / 180 * Math.PI) * 16
      item[0] = ~~item[0]
      item[1] = ~~item[1]
      if (item[0] < 0 || item[0] > 1000 ||
        item[1] < 0 || item[1] > 1000) {
        delete bullet[id]
      }
    }
  }

  onMessage(client, data) {
    const player = this.state.player[client.sessionId]
    player[2] = data.v
    player[3] = data.r === undefined ? player[3] : data.r
    data.shoot && this.state.shoot(client)
  }
}


server.register('playground', GameRoom)
server.listen(9000)



