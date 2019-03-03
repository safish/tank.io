import {Howl} from 'howler'
import {monitor} from '../core'

const
  shoot = new Howl({
    src: ['static/sounds/shoot.wav'],
    preload: true,
    autoplay: false
  }),

  lose = new Howl({
    src: ['static/sounds/lose.wav'],
    preload: true,
    autoplay: false
  })

monitor
  .on('sound:shoot', () => {
    shoot.play()
  })

  .on('sound:lose', () => {
    lose.play()
  })


export default null