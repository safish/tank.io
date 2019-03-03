import {join} from './network'
import {monitor} from '../core'

{
  const btn = document.querySelector('.btn.join')
  btn.addEventListener('click', ev => {
    const
      name = document.querySelector('input').value.trim(),
      skin = document.querySelector('.skin .active'),
      feedback = document.querySelector('.feedback')


    if (!name) {
      feedback.textContent = '👆 Input your name 👆'
      feedback.classList.add('err')
      return
    }

    if (!skin) {
      feedback.textContent = '👇 Choose your skin 👇'
      feedback.classList.add('err')
      return
    }

    feedback.classList.remove('err')

    join({name, skin: skin.dataset.skin})

  })
}


{
  const
    container = document.createElement('div'),
    dialog = document.querySelector('.dialog'),
    btn = document.querySelector('.btn.join')

  container.classList.add('d-flex', 'skin')
  dialog.insertBefore(container, btn)

  +['blue', 'green', 'dark', 'sand'].forEach(item => {
    const
      child = document.createElement('div'),
      img = document.createElement('img')
    img.src = `/static/images/tank.${item}.png`
    child.dataset.skin = item
    child.appendChild(img)
    container.appendChild(child)
  })

  container.addEventListener('click', ev => {
    let target
    ev.target.parentElement.classList.contains('skin') ?
      target = ev.target : ev.target.parentElement.parentElement.classList.contains('skin') ?
      target = ev.target.parentElement : 0

    if (!target) return

    Array.from(container.children).forEach(item => item.classList.remove('active'))

    target.classList.add('active')
  })

  monitor
    .on('game:join', () => {
      const cls = dialog.parentElement.classList
      cls.remove('d-flex')
      cls.add('d-none')
    })
    .on('game:rename', ev => {
      const
        shadow = document.querySelector('.shadow').classList,
        feedback = document.querySelector('.feedback')

      shadow.add('d-flex')
      shadow.remove('d-none')
      feedback.textContent = '👆 Retry 👆'
      feedback.classList.add('err')
    })
}

export default null
