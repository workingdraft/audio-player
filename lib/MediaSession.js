class MediaSession {
  static isSupported() {
    return 'mediaSession' in navigator
  }

  constructor(options) {
    if (!MediaSession.isSupported()) {
      return
    }

    const defaults = {
      title: '',
      artist: '',
      album: '',
      artwork: [],
      onPlay: () => {},
      onPause: () => {},
      onSeekbackward: () => {},
      onSeekforward: () => {},
      onPrevioustrack: () => {},
      onNexttrack: () => {},
    }

    this.settings = Object.assign(defaults, options)
  }

  setup() {
    navigator.mediaSession.metadata = this.getMetaData()

    this.getHandlers().forEach((handler) => {
      navigator.mediaSession.setActionHandler(handler.id, handler.func)
    })
  }

  getMetaData() {
    return new window.MediaMetadata({
      title: this.settings.title,
      artist: this.settings.artist,
      album: this.settings.album,
      artwork: this.settings.artwork.map(artwork => ({
        src: artwork.src,
        sizes: artwork.src,
        type: 'image/png',
      })),
    })
  }

  getHandlers() {
    return [{
      id: 'play',
      func: () => {
        this.settings.onPlay()
        navigator.mediaSession.playbackState = 'playing'
      },
    }, {
      id: 'pause',
      func: () => {
        this.settings.onPause()
        navigator.mediaSession.playbackState = 'playing'
      },
    }, {
      id: 'seekbackward',
      func: this.settings.onSeekbackward,
    }, {
      id: 'seekforward',
      func: this.settings.onSeekforward,
    }, {
      id: 'previoustrack',
      func: this.settings.onPrevioustrack,
    }, {
      id: 'nexttrack',
      func: this.settings.onNexttrack,
    }]
  }
}

export default MediaSession
