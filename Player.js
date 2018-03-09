import 'babel-polyfill'

import Progress from './Progress'
import MediaSession from './MediaSession'
import Chapters from './Chapters'

class Player {
  constructor(element, config) {
    this.element = element
    this.config = config

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
    this.readChapters()

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

  readChapters() {
    new Chapters(this.audio.currentSrc)
      .then(this.addChapters)
  }

  addChapters(chapters) {
    if (!chapters || chapters.constructor !== Array) {
      return
    }

    this.chapters = chapters
  }
}

export default Player
