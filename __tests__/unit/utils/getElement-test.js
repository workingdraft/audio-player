import getElement from '../../../lib/utils/getElement'

describe('utils/getElement', () => {
  document.body.innerHTML += `
    <div data-foo-bar>Foo</div>
  `

  it('returns element', () => {
    const element = getElement(document.body, 'foo', 'bar')

    expect(element.textContent).toBe('Foo')
  })
})
