import Progress from './Progress'

class Player {
  constructor(element) {
    this.element = element
    this.audio = null
    this.duration = 0

    this.togglePlay = this.togglePlay.bind(this)
    this.toggleVolume = this.toggleVolume.bind(this)
    this.handleProgress = this.handleProgress.bind(this)
    this.handleMetadata = this.handleMetadata.bind(this)
    this.handleVolumeChange = this.handleVolumeChange.bind(this)
    this.setTime = this.setTime.bind(this)
    this.setVolume = this.setVolume.bind(this)
    this.setPlaybackrate = this.setPlaybackrate.bind(this)

    this.setAudio(element)

    this.progress = new Progress({
      element: element.querySelector('[data-audio-progress]'),
      handleProgress: this.setTime,
    })

    this.volume = new Progress({
      element: element.querySelector('[data-audio-volume]'),
      handleProgress: this.setVolume,
    })

    element.querySelector('[data-audio-play]')
      .addEventListener('click', this.togglePlay)

    this.time = {
      stringElement: element.querySelector('[data-audio-time]')
    }

    element.querySelector('[data-audio-mute]')
      .addEventListener('click', this.toggleVolume)

    element.querySelector('[data-audio-speed]')
      .addEventListener('change', this.setPlaybackrate)
  }

  setAudio(element) {
    this.audio = element.querySelector('[data-audio-player]')

    this.audio.addEventListener('loadedmetadata', this.handleMetadata)
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

    this.progress.update(currentTime / this.duration * 100)
  }

  handleVolumeChange() {
    if (this.audio.volume === 0) {
      this.element.classList.add(`is-muted`)
    } else {
      this.element.classList.remove(`is-muted`)
    }

    this.volume.update(this.audio.volume * 100)
  }

  togglePlay() {
    this.element.classList.toggle(`is-playing`)

    if (this.audio.paused) {
      this.audio.play()
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

    this.audio.currentTime = parseFloat(time, 10).toFixed(2)
  }

  getTimeFromSeconds(seconds) {
    const time = []
    seconds = parseInt(seconds, 10);
    time[0] = `0${Math.floor(seconds / 3600)}`
    time[1] = `0${Math.floor((seconds - (time[0] * 3600)) / 60)}`
    time[2] = `0${seconds - (time[0] * 3600) - (time[1] * 60)}`

    return time.map(t => t.substr(-2)).join(':')
  }

  setTimeString(time) {
    this.time.stringElement.innerText = this.getTimeFromSeconds(time)
  }

  setPlaybackrate(event) {
    const rate = parseFloat(event.target.value, 10)

    this.audio.playbackRate = rate
  }
}

export default Player
