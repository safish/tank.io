import './tilemap'

const view = document.querySelector('canvas')

let {
  innerHeight: height,
  innerWidth: width,
  devicePixelRatio = 1
} = window

devicePixelRatio = 2

const pixelRatio = Math.min(2, devicePixelRatio)

/* 强制横屏 */
if (window.matchMedia('(orientation: portrait)').matches) {
  [width, height] = [height, width]
  view.style.width = `${width}px`
  view.style.height = `${height}px`
  view.style.top = `${(innerHeight - height) * .5}px`
  view.style.left = `${(innerWidth - width) * .5}px`

  PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = function(point, x, y) {
    const
      rect = this.interactionDOMElement.parentElement ? this.interactionDOMElement.getBoundingClientRect() :
        {x: 0, y: 0, width: 0, height: 0},
      resolutionMultiplier = navigator.isCocoonJS ? this.resolution : (1.0 / this.resolution)

    point.x = (y - rect.top) * (this.interactionDOMElement.width / rect.height) * resolutionMultiplier
    point.y = (1 - (x - rect.left) / rect.width) * this.interactionDOMElement.height * resolutionMultiplier
  }
}

const app = new PIXI.Application({
  view,
  width: width * pixelRatio,
  height: height * pixelRatio,
  roundPixels: true,
  sharedLoader: true,
  sharedTicker: true,
  autoResize: false,
  antialias: false,
  backgroundColor: 0xffffff
})

console.log(app.renderer)

app.align = function(node, option={}) {
  const
    {top, left, right, bottom} = option,
    delta = {x: 0, y: 0},
    rect = node.getBounds(false)

  if (top !== undefined) {
    delta.y = top - rect.top
  } else if (bottom !== undefined) {
    delta.y = (app.screen.height - bottom) - rect.bottom
  } else {
    delta.y = (app.screen.height - (rect.top + rect.bottom)) / 2
  }

  if (left !== undefined) {
    delta.x = left - rect.left
  } else if (right !== undefined) {
    delta.x = (app.screen.width - right) - rect.right
  } else {
    delta.x = (app.screen.width - (rect.left + rect.right)) / 2
  }
  node.x += delta.x / node.parent.scale.x
  node.y += delta.y / node.parent.scale.y
}

export default app
export {
  pixelRatio,
  devicePixelRatio
}