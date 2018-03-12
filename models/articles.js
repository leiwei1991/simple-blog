const mongodb = require('../db/mongodb');

class Article{
    constructor() {
      let self = this;
      self.model = mongodb.getModel('article');
    }

        // 创建一篇文章
    create(article) {
        let self = this;
        return self.model.create(article);
    }

    // 通过文章 id 获取一篇文章
    getArticleById(articleId) {
        let self = this;
        return self.model.findOne({ _id: articleId })
    }

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getArticles(author) {
        let self = this;
        const query = {}
        if (author) {
            query.author = author
        }
        
        return self.model.find(query).sort({createTime: -1})
    }

    // 通过文章 id 给 pv 加 1
    incPv(articleId) {
        let self = this;
        return self.model
        .update({ _id: articleId }, { $inc: { pv: 1 } })
    }

    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawArticleById(articleId) {
        let self = this;
        return self.model
        .findOne({ _id: articleId })
    }
    

    // 通过文章 id 更新一篇文章
    updateArticleById(articleId, data) {
        let self = this;
        return self.model.update({ _id: articleId }, { $set: {content: data}})
    }

    // 通过文章 id 删除一篇文章
    delArticleById (articleId) {
        let self = this;
        return self.model.deleteOne({ _id: articleId })
    }
}

module.exports = new Article();
