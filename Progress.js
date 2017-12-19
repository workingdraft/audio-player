class Progress {
  constructor(props) {
    const { element } = props

    const elementRect = element.getBoundingClientRect()

    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleMousemove = this.handleMousemove.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)

    this.props = props
    this.element = element
    this.inner = element.querySelector('[data-progress-inner]')
    this.preloader = element.querySelector('[data-progress-preloader]')
    this.button = element.querySelector('[data-progress-button]')
    this.width = elementRect.width
    this.offset = elementRect.left

    this.button.addEventListener('mousedown', this.handleMousedown)
  }

  /* private */getPercentage(percentage) {
    if (percentage > 100) {
      return 100
    }

    if (percentage < 0) {
      return 0
    }

    return percentage
  }

  /* private */handleMousedown() {
    document.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.handleMouseup)
  }

  /* private */handleMousemove(event) {
    const left = event.clientX - this.offset
    const percentage = this.getPercentage(left / this.width * 100)

    if (typeof this.props.handleProgress === 'function') {
      this.props.handleProgress(percentage)
    }
  }

  /* private */handleMouseup() {
    document.removeEventListener('mousemove', this.handleMousemove)
    document.removeEventListener('mouseup', this.handleMouseup)
  }

  /* private */setWidth(width) {
    this.inner.style.width = `${width}%`
  }

  update(percentage) {
    percentage = this.getPercentage(percentage)

    this.setWidth(percentage)
  }
}

export default Progress
