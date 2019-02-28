const
  http = require('http'),
  Router = require('koa-router'),
  Koa = require('koa'),
  {Server, Room} = require('colyseus'),
  app = new Koa(),
  router = new Router(),
  server = new Server({
    server: http.createServer(app)
  })



class Playground extends Room {


  onInit() {
    this.maxClients = 8
    this.index = 0
    this.frames = []
    this.disposed = false
    this.operation = {}
    this.player = {}
    this.update()
  }

  requestJoin(opt) {
    const index = Object.values(this.player).findIndex(item => item.name === opt.name)
    if (index !== -1) return false
    this.player[opt.clientId] = {name: opt.name, skin: opt.skin}
    return true
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



router
  .get('/join', async ctx => {
    ctx.body = 'ok'
  })


app
  .use(async (ctx, next) => {
    ctx.set({
      'Access-Control-Allow-Origin': '*'
    })
    await next()
  })
  .use(router.routes())
  .use(router.allowedMethods())

server.register('playground', Playground)
server.listen(9000)