class Builder {
  static index = 0

  constructor() {
    Builder.index += 1

    this.name = 'audio'
    this.id = `${this.name}.${Builder.index}`
    this.classNamePrefix = 'audio'
    this.speedLabel = 'Speed'
    this.currentSpeed = 1
    this.speeds = [0.5, 1, 1.25, 1.5, 2]
  }

  renderProgress() {
    return `
      <div class="${this.classNamePrefix}_progress audio_sound">
        <button data-audio-play>
          Pause
        </button>

        <div class="${this.classNamePrefix}_progress_bar" data-audio-progress>
          <div class="${this.classNamePrefix}_progress_preloaded" data-progress-preload></div>
          <div class="${this.classNamePrefix}_progress_inner" data-progress-inner>
            <button class="${this.classNamePrefix}_progress_button" data-progress-button></button>
          </div>

          <span data-audio-time>00:00:00</span>
        </div>
      </div>
    `
  }

  renderVolume() {
    return `
      <div class="${this.classNamePrefix}_progress ${this.classNamePrefix}_volume">
        <button class="${this.classNamePrefix}_button ${this.classNamePrefix}_button--volume" data-audio-mute>
          Volume
        </button>

        <div class="${this.classNamePrefix}_progress_bar" data-audio-volume>
          <div class="${this.classNamePrefix}_progress_inner" data-progress-inner>
            <button class="${this.classNamePrefix}_progress_button" data-progress-button></button>
          </div>
        </div>
      </div>
    `
  }

  renderSpeedOptions() {
    return this.speeds.map(speed => (
      `<option
        value="${speed}"
        ${this.currentSpeed === speed ? 'selected' : null}
      >
        ${speed}x
      </option>`
    )).join('')
  }

  renderSpeed() {
    return `
      <div class="${this.classNamePrefix}_speed">
        <label for="${this.id}-speed" class="${this.classNamePrefix}_label">
          ${this.speedLabel}
        </label>

        <select
          class="${this.classNamePrefix}_select"
          data-audio-speed
          id="${this.id}-speed"
        >
          ${this.renderSpeedOptions()}
        </select>
      </div>
    `
  }

  render() {
    const templateHtml = `
      ${this.renderProgress()}
      ${this.renderVolume()}
      ${this.renderSpeed()}
    `
    const fragment = document.createDocumentFragment()
    const div = document.createElement('div')

    div.classList.add(this.classNamePrefix)
    div.innerHTML = templateHtml

    fragment.appendChild(div)

    return fragment
  }

  appendTo(element) {
    const fragment = this.render()

    element.appendChild(fragment)
  }
}

export default Builder
