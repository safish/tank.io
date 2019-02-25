const
  http = require('http'),
  {Server, Room} = require('colyseus'),
  server = new Server({server: http.createServer()})

class Playground extends Room {
  onInit() {
    this.maxClients = 8
    this.index = 0
    this.frames = []
    this.disposed = false
    this.operation = {}
    this.update()
  }

  onDispose() {
    this.frames =
    this.operation = null
    this.disposed = true
  }

  update() {
    if (this.disposed) return

    const frames = this.frames

    frames[this.index] = Object.entries(this.operation)

    this.broadcast(frames[this.index])
    this.index += 3

    setTimeout(this.update.bind(this), 50)
  }

  onJoin(client) {
    this.send(client, {
      type: 'sync',
      frames: this.frames
    })
  }

  onLeave(client) {
    const id = client.sessionId

    delete this.operation[id]

    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i]
      frame && (this.frames[i] = frame.filter(item => item[0] !== id))
    }

    this.broadcast({
      id,
      type: 'leave',
    })
  }

  onMessage(client, data) {
    const frames = this.frames

    /* 保存最后操作 */
    this.operation[client.sessionId] = data

    // frames[this.index] = frames[this.index] || []
    // frames[this.index].push([
    //   client.sessionId,
    //   data
    // ])
  }
}

server.register('playground', Playground)
server.listen(9000)




