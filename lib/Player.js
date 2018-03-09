import 'babel-polyfill'

import Progress from './Progress'
import MediaSession from './MediaSession'
import Chapters from './Chapters'
import Builder from './Builder'

class Player {
  static name = 'audio'

  constructor(element, config) {
    this.element = element
    this.config = config

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
  }

  async initialize() {
    this.audio = this.element.querySelector(`[data-${Player.name}-player]`)

    const chapters = await this.getChapters()

    new Builder({
      chapters,
    }).appendTo(this.element)

    this.progress = new Progress({
      element: this.element.querySelector(`[data-${Player.name}-progress]`),
      handleProgress: this.setTime,
    })

    this.volume = new Progress({
      element: this.element.querySelector(`[data-${Player.name}-volume]`),
      handleProgress: this.setVolume,
    })

    this.setAudioEvents()

    this.element
      .querySelector(`[data-${Player.name}-play]`)
      .addEventListener('click', this.togglePlay)

    this.time = {
      stringElement: this.element.querySelector(`[data-${Player.name}-time]`),
    }

    this.element
      .querySelector(`[data-${Player.name}-mute]`)
      .addEventListener('click', this.toggleVolume)

    this.element
      .querySelector(`[data-${Player.name}-speed]`)
      .addEventListener('change', this.setPlaybackRate)
  }

  setAudioEvents() {
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
    const config = this.config || {}
    const settings = Object.assign(config, {
      onPlay: this.togglePlay,
      onPause: this.togglePlay,
    })

    return new MediaSession(settings)
  }

  static getTimeFromSeconds(propsSeconds) {
    const time = []
    const seconds = parseInt(propsSeconds, 10)
    time[0] = `0${Math.floor(seconds / 3600)}`
    time[1] = `0${Math.floor((seconds - (time[0] * 3600)) / 60)}`
    time[2] = `0${seconds - (time[0] * 3600) - (time[1] * 60)}`

    return time.map(t => t.substr(-2)).join(':')
  }

  getChapters() {
    return new Chapters(this.audio.currentSrc)
  }
}

export default Player
