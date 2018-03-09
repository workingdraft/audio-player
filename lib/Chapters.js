import jsmediatags from 'jsmediatags/dist/jsmediatags'


export default class Chapters {
  static getChapters({ tags }) {
    if (tags.CHAP) {
      return tags.CHAP.map(chapter => (
        {
          startTime: chapter.data.startTime,
          endTime: chapter.data.endTime,
          title: chapter.data.subFrames.TIT2.data,
        }
      ))
    }

    return []
  }

  constructor(filePath) {
    this.filePath = filePath

    return this.readFile()
  }

  readFile() {
    return new Promise((resolve, reject) => {
      jsmediatags.read(this.filePath, {
        onSuccess: async (tags) => {
          const chapters = await Chapters.getChapters(tags)
          resolve(chapters)
        },
        onError: error => reject(error),
      })
    })
  }
}
