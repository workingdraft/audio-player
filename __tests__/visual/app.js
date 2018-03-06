import { Player, Builder } from '../../'

window.onload = () => {
  const elements = document.querySelectorAll('[data-render]')
  const builder = new Builder()

  Array.from(elements).forEach((element) => {
    element.appendChild(
      builder.render()
    )

    new Player(element)
  })
}
