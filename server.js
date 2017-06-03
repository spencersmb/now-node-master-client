const express = require('express')
const httpProxy = require('http-proxy')
const cookieParser = require('cookie-parser')
const router = require('./routes/index')
// const compression = require('compression'); // for production tests

const next = require('next')
const bodyParser = require('body-parser') // turns the body into json object

// ENV SETUP
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const prod = process.env.NODE_ENV === 'production'
const expressServer = express()

if (prod) {
  /*

  Production Setup with express

  */
  app.prepare().then(() => {
    expressServer.use(cookieParser())
    // allows us to send json to our express app
    expressServer.use(bodyParser.json())

    router.routes(expressServer, app, handle)
  })
} else {
  /*

  Reverse Proxy Setup for Dev with express

  */
  const apiProxy = httpProxy.createProxyServer({ changeOrigin: true })

  app.prepare().then(() => {
    // expressServer.use('/api', (req, res) => {
    //   apiProxy.web(req, res, { target: 'http://localhost:7777' })
    // })
    expressServer.use(cookieParser())
    expressServer.use('/api/**', (req, res) => {
      apiProxy.web(req, res, {
        target: 'http://localhost:7777/' + req.params[0]
      })
    })

    expressServer.use(bodyParser.json())

    router.routes(expressServer, app, handle)
  })
}
