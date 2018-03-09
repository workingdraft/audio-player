import {
  Player,
  Builder,
} from '../../'

const config = {
  title: 'Unforgettable',
  artist: 'Nat King Cole',
  album: 'The Ultimate Collection (Remastered)',
  artwork: [{
    src: 'https://dummyimage.com/96x96',
    sizes: '96x96',
  },
  {
    src: 'https://dummyimage.com/128x128',
    sizes: '128x128',
  },
  {
    src: 'https://dummyimage.com/192x192',
    sizes: '192x192',
  },
  {
    src: 'https://dummyimage.com/256x256',
    sizes: '256x256',
  },
  {
    src: 'https://dummyimage.com/384x384',
    sizes: '384x384',
  },
  {
    src: 'https://dummyimage.com/512x512',
    sizes: '512x512',
  }],
}

window.onload = () => {
  const elements = document.querySelectorAll('[data-render]')

  Array.from(elements).forEach((element) => {
    const builder = new Builder()

    builder.appendTo(element)

    return new Player(element, config)
  })
}
