module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/articles')
  })
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/articles', require('./articles'))

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}
