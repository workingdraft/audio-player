import Chapters from '../../lib/Chapters'

describe('Chapters', () => {
  it('returns', async () => {
    const chapters = await new Chapters('http://localhost:3300/test-2.mp3')

    expect(chapters.length).toBe(2)
  })
})
