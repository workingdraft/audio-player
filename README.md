# Audio Player

Audio Player for [http://workingdraft.de/](http://workingdraft.de/).

[![Build Status](https://travis-ci.org/workingdraft/audio-player.svg?branch=master)](https://travis-ci.org/workingdraft/audio-player)

## Usage

Install via npm or yarn

### Implementation

#### HTML

You need to import this module’s styles to get a decent styling.

Add your audio file to HTML and wrap it in a container.

```html
<div data-my-app>
  <audio preload="auto" data-audio-player>
    <source src="/test.mp3" type="audio/mpeg">
  </audio>
</div>
```

Within your script you now need to initialize the player by building the markup
and running the player’s functions.

```javascript
import { Player } from 'wd-audio-player'

const config = {
  // …
}
const element = document.querySelector('[data-my-app]')

new Player(element, config).initialize()
```

## License

This project is under [MIT license](./LICENSE).
