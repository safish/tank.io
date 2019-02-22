const
  http = require('http'),
  {Server, Room} = require('colyseus'),
  server = new Server({server: http.createServer()})

class Playground extends Room {
  onInit() {
    this.maxClients = 2
    this.index = 3
    this.frames = [[]]
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

    frames[this.index] = frames[this.index] || []

    /* 同步最后操作 */
    for (const id in this.operation) {
      frames[this.index].push([
        id, this.operation[id]
      ])
    }

    this.broadcast([
      this.index,
      frames[this.index]
    ])

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
    delete this.operation[client.sessionId]
  }

  onMessage(client, data) {
    const frames = this.frames

    /* 保存最后操作 */
    this.operation[client.sessionId] = data

    frames[this.index] = frames[this.index] || []
    frames[this.index].push([
      client.sessionId,
      data
    ])
  }
}

server.register('playground', Playground)
server.listen(9000)




