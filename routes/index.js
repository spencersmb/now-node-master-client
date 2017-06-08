const tokenCtrl = require('../serverMiddleware/tokenCtrl')
const port = process.env.PORT || 3000
const tokenUtils = require('../utils/serverUtilsTokens')
const querystring = require('querystring')

exports.routes = (expressServer, app, handle) => {
  expressServer.get('/stores/', tokenCtrl.tokenRefreshCheck, (req, res) => {
    return app.render(req, res, '/stores', req.query)
  })

  expressServer.get('/other/', tokenCtrl.tokenRefreshCheck, (req, res) => {
    return app.render(req, res, '/other', req.query)
  })

  expressServer.get('/account/reset/:token*?', async (req, res) => {
    const resetToken = req.params.token

    req.query = {
      token: resetToken
    }

    if (!resetToken) {
      return res.redirect('/login')
    }

    // CHeck token status of reset exp in DB
    const response = await tokenUtils.resetCheck(resetToken)

    if (response.status === 422) {
      const query = querystring.stringify({
        error: true
      })
      return res.redirect('/login?' + query)
    }

    return app.render(req, res, '/auth/passwordReset', req.query)
  })

  expressServer.get('/account', tokenCtrl.tokenRefreshCheck, (req, res) => {
    return app.render(req, res, '/auth/account', req.query)
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

  expressServer.get('/store/:slug', (req, res) => {
    req.query = {
      slug: req.params.slug
    }

    return app.render(req, res, '/store/details', req.query)
  })

  expressServer.get('/login?', (req, res) => {
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
}
