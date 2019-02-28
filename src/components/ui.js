// import {connect} from './network'

document.querySelector('.btn.join').addEventListener('click', ev => {
  const name = document.querySelector('input').value
  // connect()
  console.log(name)
})

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
