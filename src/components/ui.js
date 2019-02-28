import {join} from './network'

{
  const btn = document.querySelector('.btn.join')
  btn.addEventListener('click', ev => {
    const
      name = document.querySelector('input').value.trim(),
      skin = document.querySelector('.skin .active'),
      feedback = document.querySelector('.feedback')


    if (!name) {
      feedback.textContent = '👆 Retry 👆'
      feedback.classList.add('retry')
      return
    }

    if (!skin) {
      feedback.textContent = '👇 Choose your skins 👇'
      feedback.classList.add('retry')
      return
    }

    feedback.classList.remove('retry')

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
}

export default null
