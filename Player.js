import Progress from './Progress'
import MediaSession from './MediaSession'

class Player {
  constructor(element) {
    this.element = element
    this.name = 'audio'
    this.audio = null
    this.duration = 0

    this.togglePlay = this.togglePlay.bind(this)
    this.toggleVolume = this.toggleVolume.bind(this)
    this.handleProgress = this.handleProgress.bind(this)
    this.handleMetadata = this.handleMetadata.bind(this)
    this.handleVolumeChange = this.handleVolumeChange.bind(this)
    this.setTime = this.setTime.bind(this)
    this.setVolume = this.setVolume.bind(this)
    this.setPlaybackRate = this.setPlaybackRate.bind(this)
    this.setupMediaSession = this.setupMediaSession.bind(this)

    this.progress = new Progress({
      element: element.querySelector(`[data-${this.name}-progress]`),
      handleProgress: this.setTime,
    })

    this.volume = new Progress({
      element: element.querySelector(`[data-${this.name}-volume]`),
      handleProgress: this.setVolume,
    })

    this.setAudio(element)

    element
      .querySelector(`[data-${this.name}-play]`)
      .addEventListener('click', this.togglePlay)

    this.time = {
      stringElement: element.querySelector(`[data-${this.name}-time]`),
    }

    element
      .querySelector(`[data-${this.name}-mute]`)
      .addEventListener('click', this.toggleVolume)

    element
      .querySelector(`[data-${this.name}-speed]`)
      .addEventListener('change', this.setPlaybackRate)
  }

  setAudio(element) {
    this.audio = element.querySelector(`[data-${this.name}-player]`)

    this.audio.addEventListener('loadedmetadata', this.handleMetadata)

    if (this.audio.readyState >= 2) {
      this.handleMetadata()
    }

    this.audio.addEventListener('timeupdate', this.handleProgress)
    this.audio.addEventListener('volumechange', this.handleVolumeChange)
  }

  handleMetadata() {
    this.duration = this.audio.duration
    this.volume.update(this.audio.volume * 100)
  }

  handleProgress() {
    const currentTime = Math.floor(this.audio.currentTime)

    this.setTimeString(currentTime)

    this.progress.update((currentTime / this.duration) * 100)
  }

  handleVolumeChange() {
    if (this.audio.volume === 0) {
      this.element.classList.add('is-muted')
    } else {
      this.element.classList.remove('is-muted')
    }

    this.volume.update(this.audio.volume * 100)
  }

  togglePlay() {
    this.element.classList.toggle('is-playing')

    if (this.audio.paused) {
      this.audio.play()
        .then(this.setupMediaSession)
    } else {
      this.audio.pause()
    }
  }

  toggleVolume() {
    if (this.audio.volume > 0) {
      this.oldVolume = this.audio.volume
      this.audio.volume = 0
    } else {
      this.audio.volume = this.oldVolume
    }
  }

  setVolume(volume) {
    this.audio.volume = volume / 100
  }

  setTime(timePercent) {
    const time = this.audio.duration * (timePercent / 100)

    this.audio.currentTime = time.toFixed(2)
  }

  setTimeString(time) {
    this.time.stringElement.innerText = Player.getTimeFromSeconds(time)
  }

  setPlaybackRate(event) {
    this.audio.playbackRate = parseFloat(event.target.value)
  }

  setupMediaSession() {
    const mediaSession = new MediaSession({
      title: 'Unforgettable',
      artist: 'Nat King Cole',
      album: 'The Ultimate Collection (Remastered)',
      artwork: [
        { src: 'https://dummyimage.com/96x96', sizes: '96x96', type: 'image/png' },
        { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
        { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
        { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
        { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
        { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
      ],
      onPlay: this.togglePlay,
      onPause: this.togglePlay,
    })

    return mediaSession
  }

  static getTimeFromSeconds(propsSeconds) {
    const time = []
    const seconds = parseInt(propsSeconds, 10)
    time[0] = `0${Math.floor(seconds / 3600)}`
    time[1] = `0${Math.floor((seconds - (time[0] * 3600)) / 60)}`
    time[2] = `0${seconds - (time[0] * 3600) - (time[1] * 60)}`

    return time.map(t => t.substr(-2)).join(':')
  }
}

export default Player
