import Builder from '../../lib/Builder'

describe('Builder', () => {
  it('should render speed options', () => {
    const builder = new Builder({})
    const tree = builder.renderSpeed()

    expect(tree).toMatchSnapshot()
  })

  it('should render progress bar', () => {
    const builder = new Builder({})
    const tree = builder.renderProgress()

    expect(tree).toMatchSnapshot()
  })

  it('should render volume', () => {
    const builder = new Builder({})
    const tree = builder.renderVolume()

    expect(tree).toMatchSnapshot()
  })

  it('should render chapter', () => {
    const builder = new Builder({})
    const tree = builder.renderChapter({
      startTime: 100,
      fullTime: 200,
      title: 'foo',
    })

    expect(tree).toMatchSnapshot()
  })

  it('should render no chapter if there is noe', () => {
    const builder = new Builder({})
    const tree = builder.renderChapter()

    expect(tree).toMatchSnapshot()
  })


  it('renders full player', () => {
    const builder = new Builder({
      chapters: [{
        startTime: 100,
        fullTime: 200,
        title: 'foo',
      }],
    })
    const tree = builder.render().innerHTML

    expect(tree).toMatchSnapshot()
  })

  it('should append player to body', () => {
    const builder = new Builder({
      chapters: [{
        startTime: 100,
        fullTime: 200,
        title: 'foo',
      }],
    })

    const body = document.querySelector('body')

    builder.appendTo(body)

    expect(Array.from(document.querySelectorAll(`.${builder.classNamePrefix}`)).length).toBe(1)
  })
})
