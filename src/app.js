const app = new PIXI.Application({
  view: document.querySelector('canvas'),
  width: 1336,
  height: 750
})

const g = new PIXI.Graphics()
  .beginFill(0xffcc33)
  .drawCircle(0, 0, 30)
  .endFill()

app.stage.addChild(g)
g.y = 300

let i = 0
app.ticker.add(() => {
  if (i) return i = 0
  g.x += 5
})