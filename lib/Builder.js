class Builder {
  static index = 0

  constructor({ chapters }) {
    Builder.index += 1

    this.name = 'audio'
    this.id = `${this.name}.${Builder.index}`
    this.classNamePrefix = 'audio'
    this.speedLabel = 'Speed'
    this.currentSpeed = 1
    this.speeds = [0.5, 1, 1.25, 1.5, 2]
    this.chapters = chapters

    this.renderChapter = this.renderChapter.bind(this)
  }

  renderProgress() {
    return `
      <div class="${this.classNamePrefix}_progress audio_sound">
        <button class="${this.classNamePrefix}_button ${this.classNamePrefix}_button--play" data-audio-play>
          <svg
            class="${this.classNamePrefix}_button_icon"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>

          <svg
            class="${this.classNamePrefix}_button_icon audio_button_icon--inactive"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"/>
          </svg>
        </button>

        <div class="${this.classNamePrefix}_progress_bar" data-audio-progress>
          <div class="${this.classNamePrefix}_progress_preloaded" data-progress-preloaded></div>
          <div class="${this.classNamePrefix}_progress_inner" data-progress-inner>
            <button class="${this.classNamePrefix}_progress_button" data-progress-button></button>
          </div>

          <ul class="${this.classNamePrefix}_chapters">
            ${this.chapters.map(this.renderChapter).join('')}
          </ul>

          <span class="${this.classNamePrefix}_duration" data-audio-time>00:00:00</span>
        </div>
      </div>
    `
  }

  renderChapter(chapter) {
    const percent = ((chapter.startTime / chapter.fullTime) * 100).toFixed(2)

    return `
      <li
        class="${this.classNamePrefix}_chapters_chapter"
        data-${this.name}-chapter="${chapter.startTime}"
        style="left: ${percent}%;"
      >
        <span class="${this.classNamePrefix}_chapters_chapter_title">
          ${chapter.title}
        </span>
      </li>
    `
  }

  renderVolume() {
    return `
      <div class="${this.classNamePrefix}_progress ${this.classNamePrefix}_volume">
        <button class="${this.classNamePrefix}_button ${this.classNamePrefix}_button--volume" data-audio-mute>
          <svg
            class="${this.classNamePrefix}_button_icon ${this.classNamePrefix}_button_icon--small"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m3 9v6h4l5 5v-16l-5 5zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zm-2.5-8.77v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>

          <svg
            class="${this.classNamePrefix}_button_icon ${this.classNamePrefix}_button_icon--small audio_button_icon--inactive"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
          </svg>
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
