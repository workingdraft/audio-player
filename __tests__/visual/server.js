const path = require('path')
const express = require('express')

class App {
  constructor() {
    this.express = express()

    this.express.use('/', express.static('__tests__/visual/'))

    this.mountRoutes()
  }

  mountRoutes() {
    const router = express.Router()
    const cssPath = path.join(__dirname, '../../', 'player.css')

    router.get('/player.css', (req, res) => res.sendFile(cssPath))

    // Use the router
    this.express.use('/', router)
  }
}

const app = new App().express

const port = process.env.PORT || 3300

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
