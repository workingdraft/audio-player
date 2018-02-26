import MediaSession from '../../MediaSession'
import Player from '../../Player'
import Progress from '../../Progress'

const elementMock = {
  querySelector: jest.fn().mockReturnThis(),
  addEventListener: jest.fn(),
  getBoundingClientRect: jest.fn(),
  classList: {
    add: jest.fn(),
    toggle: jest.fn(),
    remove: jest.fn(),
  },
}

const audioMock = {
  pause: jest.fn(),
  play: jest.fn(() => Promise.resolve()),
}

jest.mock('../../MediaSession')
jest.mock('../../Progress')

describe('Player', () => {
  let player = null

  beforeEach(() => {
    player = new Player(elementMock)
    player.audio = audioMock

    // Clear mocks
    MediaSession.mockClear()
    Progress.mockClear()
  })

  describe('constructor()', () => {
    test('initializes new Progress object for progress', () => {
      // then
      expect(player.progress).toBeInstanceOf(Progress)
    })

    test('initializes new Progress object for volume', () => {
      // then
      expect(player.volume).toBeInstanceOf(Progress)
    })

    test('calls setAudio', () => {
      // given
      jest.spyOn(Player.prototype, 'setAudio')

      // when
      player = new Player(elementMock)

      // then
      expect(player.setAudio).toHaveBeenCalled()
    })

    test('adds an event listener to toggle the play state', () => {
      // then
      expect(elementMock.querySelector).toHaveBeenCalledWith('[data-audio-mute]')
      expect(elementMock.addEventListener).toHaveBeenCalledWith('click', player.togglePlay)
    })

    test('adds an event listener to mute/unmute the volume', () => {
      // then
      expect(elementMock.querySelector).toHaveBeenCalledWith('[data-audio-mute]')
      expect(elementMock.addEventListener).toHaveBeenCalledWith('click', player.toggleVolume)
    })

    test('adds an event listener to changes to the playback rate', () => {
      // then
      expect(elementMock.querySelector).toHaveBeenCalledWith('[data-audio-speed]')
      expect(elementMock.addEventListener).toHaveBeenCalledWith('change', player.setPlaybackRate)
    })
  })

  describe('setAudio()', () => {
    test('queries for [data-audio-player]', () => {
      // given
      const elementMock = {
        querySelector: jest.fn().mockReturnThis(),
        addEventListener: jest.fn(),
      }

      // when
      player.setAudio(elementMock)

      // then
      expect(elementMock.querySelector).toHaveBeenCalledWith('[data-audio-player]')
    })

    test('adds an event listener to the loadedmetadata event', () => {
      // given
      const elementMock = {
        querySelector: jest.fn().mockReturnThis(),
        addEventListener: jest.fn(),
      }

      // when
      player.setAudio(elementMock)

      // then
      expect(player.audio.addEventListener).toHaveBeenCalledWith('loadedmetadata', player.handleMetadata)
    })

    test('calls handleMetadata() if the readyState is >= 2', () => {
      // given
      player.handleMetadata = jest.fn()

      const elementMock = {
        querySelector: jest.fn().mockImplementationOnce(() => {
          return {
            addEventListener: jest.fn(),
            readyState: 2,
          }
        }),
      }

      // when
      player.setAudio(elementMock)

      // then
      expect(player.handleMetadata).toHaveBeenCalled()
    })

    test('doesn\'t call handleMetadata() if the readyState is < 2', () => {
      // given
      player.handleMetadata = jest.fn()

      const elementMock = {
        querySelector: jest.fn().mockImplementationOnce(() => {
          return {
            addEventListener: jest.fn(),
            readyState: 1,
          }
        }),
      }

      // when
      player.setAudio(elementMock)

      // then
      expect(player.handleMetadata).not.toHaveBeenCalled()
    })

    test('adds an event listener to the timeupdate event', () => {
      // given
      const elementMock = {
        querySelector: jest.fn().mockReturnThis(),
        addEventListener: jest.fn(),
      }

      // when
      player.setAudio(elementMock)

      // then
      expect(player.audio.addEventListener).toHaveBeenCalledWith('timeupdate', player.handleProgress)
    })

    test('adds an event listener to the volumechange event', () => {
      // given
      const elementMock = {
        querySelector: jest.fn().mockReturnThis(),
        addEventListener: jest.fn(),
      }

      // when
      player.setAudio(elementMock)

      // then
      expect(player.audio.addEventListener).toHaveBeenCalledWith('volumechange', player.handleVolumeChange)
    })
  })

  describe('handleMetadata()', () => {
    test('updates the duration', () => {
      // given
      const testDuration = 123
      player.audio.duration = testDuration
      player.volume.update = jest.fn() // Avoid calling actual implementation

      // when
      player.handleMetadata()

      // then
      expect(player.duration).toBe(testDuration)
    })

    test('updates the volume percentage', () => {
      // given
      const testVolume = 0.29
      player.audio.volume = testVolume
      player.volume.update = jest.fn()

      // when
      player.handleMetadata()

      // then
      expect(player.volume.update).toHaveBeenCalledWith(testVolume * 100)
    })
  })

  describe('handleProgress()', () => {
    test('sets the current time', () => {
      // given
      const currentTime = 123
      player.audio.currentTime = currentTime
      player.setTimeString = jest.fn()
      player.progress.update = jest.fn() // Avoid calling actual implementation

      // when
      player.handleProgress()

      // then
      expect(player.setTimeString).toHaveBeenCalledWith(Math.floor(currentTime))
    })

    test('updates the progress', () => {
      // given
      const currentTime = 234
      const duration = 12
      player.audio.currentTime = currentTime
      player.duration = duration
      player.setTimeString = jest.fn()
      player.progress.update = jest.fn() // Avoid calling actual implementation

      // when
      player.handleProgress()

      // then
      expect(player.progress.update).toHaveBeenCalledWith(Math.floor(currentTime) / duration * 100)
    })
  })

  describe('handleVolumeChange()', () => {
    test('adds is-muted class if volume is 0', () => {
      // given
      player.audio.volume = 0
      player.volume.update = jest.fn() // Avoid calling actual implementation

      // when
      player.handleVolumeChange()

      // then
      expect(player.element.classList.add).toHaveBeenCalledWith('is-muted')
    })

    test('removes is-muted class if volume is not 0', () => {
      // given
      player.audio.volume = 4
      player.volume.update = jest.fn() // Avoid calling actual implementation

      // when
      player.handleVolumeChange()

      // then
      expect(player.element.classList.remove).toHaveBeenCalledWith('is-muted')
    })

    test('updates volume percentage', () => {
      // given
      const volume = 7
      player.audio.volume = volume
      player.volume.update = jest.fn()

      // when
      player.handleVolumeChange()

      // then
      expect(player.volume.update).toHaveBeenCalledWith(volume * 100)
    })
  })

  describe('togglePlay()', () => {
    test('toggles the is-playing class', () => {
      // when
      player.togglePlay()

      // then
      expect(elementMock.classList.toggle).toHaveBeenCalledWith('is-playing')
    })

    test('starts audio and calls setupMediaSession if the audio is paused', () => {
      // given
      player.audio.paused = true
      player.setupMediaSession = jest.fn()

      // when
      player.togglePlay()

      // then
      expect(audioMock.play).toHaveBeenCalled()
    })

    test('pauses audio if the audio is not paused', () => {
      // given
      player.audio.paused = false

      // when
      player.togglePlay()

      // then
      expect(audioMock.pause).toHaveBeenCalled()
    })
  })

  describe('toggleVolume()', () => {
    test('mutes volume and saves volume level', () => {
      // given
      const volume = 37 // > 0
      player.audio.volume = volume

      // when
      player.toggleVolume()

      // then
      expect(player.oldVolume).toBe(volume)
      expect(player.audio.volume).toBe(0)
    })

    test('unmutes volume and restores previous volume level', () => {
      // given
      const oldVolume = 81
      player.audio.volume = 0
      player.oldVolume = oldVolume

      // when
      player.toggleVolume()

      // then
      expect(player.audio.volume).toBe(oldVolume)
    })
  })

  describe('setVolume()', () => {
    test('sets the given volume in percent to the audio volume', () => {
      // given
      const inputVolume = 28

      // when
      player.setVolume(inputVolume)

      // then
      expect(player.audio.volume).toBe(inputVolume / 100)
    })
  })

  describe('setTime()', () => {
    test('sets the given time in percent to the current audio time', () => {
      // given
      const inputTimePercent = 73
      const duration = 1000
      const expectedResult = (duration * inputTimePercent / 100).toFixed(2)
      player.audio.duration = duration

      // when
      player.setTime(inputTimePercent)

      // then
      expect(player.audio.currentTime).toBe(expectedResult)
    })
  })

  describe('setTimeString()', () => {
    test('format the given time and set it as the content of the time display', () => {
      // given
      const inputTime = 123
      const outputTime = '11:22:33'
      jest.spyOn(Player, 'getTimeFromSeconds').mockImplementationOnce(() => outputTime)

      // when
      player.setTimeString(inputTime)

      // then
      expect(Player.getTimeFromSeconds).toHaveBeenCalledWith(inputTime)
      expect(player.time.stringElement.innerText).toBe(outputTime)
    })
  })

  describe('setPlaybackRate()', () => {
    test('sets the playback rate to the given event target value', () => {
      // given
      const playBackRate = 1.2

      // when
      player.setPlaybackRate({
        target: {
          value: playBackRate,
        },
      })

      // then
      expect(player.audio.playbackRate).toBe(playBackRate)
    })
  })

  describe('setupMediaSession()', () => {
    test('creates a new media session', () => {
      // when
      player.setupMediaSession()

      // then
      expect(MediaSession).toHaveBeenCalled()
    })
  })

  describe('getTimeFromSeconds()', () => {
    test('returns the correct string for 0 seconds', () => {
      // given
      const hours = 0
      const minutes = 0
      const seconds = 0
      const inputSeconds = (hours * 3600) + (minutes * 60) + seconds

      // when/then
      expect(Player.getTimeFromSeconds(inputSeconds)).toBe(`0${hours}:0${minutes}:0${seconds}`)
    })

    test('returns the correct string for < 1 minute', () => {
      // given
      const hours = 0
      const minutes = 0
      const seconds = 42
      const inputSeconds = (hours * 3600) + (minutes * 60) + seconds

      // when/then
      expect(Player.getTimeFromSeconds(inputSeconds)).toBe(`0${hours}:0${minutes}:${seconds}`)
    })

    test('returns the correct string for < 1 hour', () => {
      // given
      const hours = 0
      const minutes = 20
      const seconds = 42
      const inputSeconds = (hours * 3600) + (minutes * 60) + seconds

      // when/then
      expect(Player.getTimeFromSeconds(inputSeconds)).toBe(`0${hours}:${minutes}:${seconds}`)
    })

    test('returns the correct string for > 1 hour', () => {
      // given
      const hours = 4
      const minutes = 20
      const seconds = 42
      const inputSeconds = (hours * 3600) + (minutes * 60) + seconds

      // when/then
      expect(Player.getTimeFromSeconds(inputSeconds)).toBe(`0${hours}:${minutes}:${seconds}`)
    })
  })
})
