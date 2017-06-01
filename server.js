const express = require('express')
const httpProxy = require('http-proxy')
const cookieParser = require('cookie-parser')
const fetch = require('isomorphic-unfetch')
const tokenUtils = require('./utils/serverUtilsTokens')
const tokenCtrl = require('./serverMiddleware/tokenCtrl')
// const compression = require('compression');
const next = require('next')
const { createServer } = require('http')
const routes = require('./routes')
const { parse } = require('url')
const { join } = require('path')
// const fs = require('fs')
const bodyParser = require('body-parser') // turns the body into json object
// const colors = require('colors')
// ENV SETUP
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = routes.getRequestHandler(app)
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000
const prod = process.env.NODE_ENV === 'production'

const expressServer = express()

const fetchCookiesForheader = cookies => {
  return cookies.split(';').filter(c => {
    if (c.trim().startsWith('jwt=')) {
      return c
    }
    if (c.trim().startsWith('_CSRF=')) {
      return c
    }
  })
  // .find(c => c.trim().startsWith('jwt='))
}

if (prod) {
  /*

  Production Setup with express

  */
  app.prepare().then(() => {
    expressServer.use(cookieParser())
    // allows us to send json to our express app
    expressServer.use(bodyParser.json())

    // NEXT ROUTE EXAMPLE BELOW
    // page path in app is: /pages/store
    // filename is: edit.js
    // routes.add('edit', '/store/:id/edit', 'store/edit')
    expressServer.get('/store/:id/edit', (req, res) => {
      req.query = {
        id: req.params.id
      }

      return app.render(req, res, '/store/edit', req.query)
    })

    // routes.add('details', '/store/:slug', 'store/details')
    expressServer.get('/store/:slug', (req, res) => {
      req.query = {
        slug: req.params.slug
      }

      return app.render(req, res, '/store/details', req.query)
    })

    // routes.add('login', '/login', 'auth/login')
    expressServer.get('/login', (req, res) => {
      return app.render(req, res, '/auth/login', req.query)
    })

    expressServer.get('/logout', (req, res) => {
      return app.render(req, res, '/auth/logout', req.query)
    })

    expressServer.get('/register', (req, res) => {
      return app.render(req, res, '/auth/register', req.query)
    })

    expressServer.get('/tags/:tag*?', (req, res) => {
      req.query = {
        tag: req.params.tag
      }

      return app.render(req, res, '/tags', req.query)
    })

    expressServer.get('*', (req, res) => {
      return handle(req, res)
    })

    expressServer.listen(port, err => {
      if (err) throw err
      console.log('> Ready on: ' + port + ' using express')
    })
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
    // Other next-specific stuff
    expressServer.get('/stores/', tokenCtrl.tokenRefreshCheck, (req, res) => {
      return app.render(req, res, '/stores', req.query)
    })

    expressServer.get('/other/', tokenCtrl.tokenRefreshCheck, (req, res) => {
      return app.render(req, res, '/other', req.query)
    })

    // NEXT ROUTE EXAMPLE BELOW
    // page path in app is: /pages/store
    // filename is: edit.js
    // routes.add('edit', '/store/:id/edit', 'store/edit')
    expressServer.get('/store/:id/edit', (req, res) => {
      req.query = {
        id: req.params.id
      }

      return app.render(req, res, '/store/edit', req.query)
    })

    // routes.add('details', '/store/:slug', 'store/details')
    expressServer.get('/store/:slug', (req, res) => {
      req.query = {
        slug: req.params.slug
      }

      return app.render(req, res, '/store/details', req.query)
    })

    // routes.add('login', '/login', 'auth/login')
    expressServer.get('/login', (req, res) => {
      return app.render(req, res, '/auth/login', req.query)
    })

    expressServer.get('/logout', (req, res) => {
      return app.render(req, res, '/auth/logout', req.query)
    })

    expressServer.get('/register', (req, res) => {
      return app.render(req, res, '/auth/register', req.query)
    })

    expressServer.get('/tags/:tag*?', (req, res) => {
      req.query = {
        tag: req.params.tag
      }

      return app.render(req, res, '/tags', req.query)
    })

    expressServer.get('*', (req, res) => {
      return handle(req, res)
    })

    expressServer.listen(port, err => {
      if (err) throw err
      console.log('> Ready on: ' + port + ' using express')
    })
  })
}
/*

Start APP WITH STATIC FILES

*/
// app.prepare().then(() => {
//   createServer((req, res) => {
//     const parsedUrl = parse(req.url, true)
//     const rootStaticFiles = [
//       '/robots.txt',
//       '/sitemap.xml',
//       '/favicon.ico',
//       '/styles.css'
//     ]
//     if (rootStaticFiles.indexOf(parsedUrl.pathname) > -1) {
//       const path = join(__dirname, 'static', parsedUrl.pathname)
//       app.serveStatic(req, res, path)
//     } else {
//       handler(req, res, parsedUrl)
//     }
//   }).listen(port, err => {
//     if (err) throw err
//     console.log('> Ready on: ' + port)
//   })
// })

/*

Start APP

*/
// app.prepare().then(() => {
//   createServer(handler).listen(port, err => {
//     if (err) throw err
//     console.log('> Ready on: ' + port)
//   })
// })
