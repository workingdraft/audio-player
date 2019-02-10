import jsmediatags from 'jsmediatags/dist/jsmediatags'

export default class Chapters {
  constructor(filePath, duration) {
    this.filePath = filePath
    this.duration = duration

    return this.readFile()
  }

  readFile() {
    return new Promise((resolve, reject) => {
      try {
        jsmediatags.read(this.filePath, {
          onSuccess: async (tags) => {
            const chapters = await this.getChapters(tags)
            resolve(chapters)
          },
          onError: error => reject(error),
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  getChapters({ tags }) {
    if (tags.CHAP && tags.CHAP.constructor === Array) {
      return tags.CHAP.map(chapter => (
        {
          startTime: chapter.data.startTime,
          endTime: chapter.data.endTime,
          fullTime: this.duration,
          title: chapter.data.subFrames.TIT2.data,
        }
      ))
    }

    return []
  }
}
