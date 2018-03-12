const express = require('express')
const router = express.Router()
const marked = require('marked');

const checkLogin = require('../middlewares/check').checkLogin
const articleModel = require('../models/articles')

// GET /articles 所有用户或者特定用户的文章页
//   eg: GET /articles?author=xxx
router.get('/', function (req, res, next) {
  const author = req.query.author

  articleModel.getArticles(author)
    .then(function (articles) {
      res.render('articles', {
        articles: articles
      })
    })
    .catch(next)
})

// POST /articles/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user.name
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let article = {
    author: author,
    title: title,
    content: content,
    createTime: Date.now()
  }

  articleModel.create(article)
    .then(function (result) {
      let article = result;
      req.flash('success', '发表成功')
      // 发表成功后跳转到该文章页
      res.redirect(`/articles/${article._id}`)
    })
    .catch(next)
})

// GET /articles/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.render('create')
})

// GET /articles/:articleId 单独一篇的文章页
router.get('/:articleId', function (req, res, next) {
  const articleId = req.params.articleId

  articleModel.getArticleById(articleId)
    .then(article => {
      if (!article) {
        return Promise.reject('no_article')
      } else {
        articleModel.incPv(articleId)
          .then(()=> {
            article.content = marked(article.content)
            res.render('article', {
              article: article
            })
          })
      }
    })
    .catch(next)
})

// GET /articles/:articleId/edit 更新文章页
router.get('/:articleId/edit', checkLogin, function (req, res, next) {
  const articleId = req.params.articleId
  const author = req.session.user._id

  articleModel.getRawArticleById(articleId)
    .then(function (article) {
      if (!article) {
        throw new Error('该文章不存在')
      }
      if (author.toString() !== article.author._id.toString()) {
        throw new Error('权限不足')
      }
      res.render('edit', {
        article: article
      })
    })
    .catch(next)
})

// POST /articles/:articleId/edit 更新一篇文章
router.post('/:articleId/edit', checkLogin, function (req, res, next) {
  const articleId = req.params.articleId
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  articleModel.getRawArticleById(articleId)
    .then(function (article) {
      if (!article) {
        throw new Error('文章不存在')
      }
      if (article.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }

      articleModel.updateArticleById(articleId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/articles/${articleId}`)
        })
        .catch(next)
    })
})

// GET /articles/:articleId/remove 删除一篇文章
router.get('/:articleId/remove', checkLogin, function (req, res, next) {
  const articleId = req.params.articleId
  const author = req.session.user.name

  articleModel.getRawArticleById(articleId)
    .then(function (article) {
      if (!article) {
        throw new Error('文章不存在')
      }
      if (article.author.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      articleModel.delArticleById(articleId)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/articles')
        })
        .catch(next)
    })
})

module.exports = router
