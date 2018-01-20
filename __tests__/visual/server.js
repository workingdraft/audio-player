const express = require('express')

class App {
  constructor() {
    this.express = express()

    this.express.use('/', express.static('__tests__/visual/'))
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
