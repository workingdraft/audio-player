# Audio Player

Audio Player for [http://workingdraft.de/](http://workingdraft.de/).

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
import { Player, Builder } from 'wd-audio-player'

const element = document.querySelector('[data-my-app]')
const builder = new Builder()
const player = builder.render()

element.appendChild(player)

new Player(element)
```

## License

This project is under [MIT license](./LICENSE).
