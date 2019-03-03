import core from '../core'

export default function() {
  return new Promise(resolve => {
    core.loader
      .add('static/textures/misc.json')
      .add('static/textures/tank.json')
      .add('tile.png', 'static/textures/tile.png')
      .add('map', 'static/maps/1.json')
      .load(resolve)
  })
}