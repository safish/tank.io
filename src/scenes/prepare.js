import core from '../core'

export default function() {
  return new Promise(resolve => {
    core.loader
      .add('static/textures/misc.json')
      .load(resolve)
  })
}