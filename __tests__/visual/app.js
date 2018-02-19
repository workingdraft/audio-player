import Player from '../../Player'

window.onload = () => {
  const element = document.querySelector('[data-audio]')
  const player = new Player(element)
}
