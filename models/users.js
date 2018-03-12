const mongodb = require('../db/mongodb');

class User{
    constructor() {
      let self = this;
      self.model = mongodb.getModel('user');
    }

    create(user) {
      let self = this;

      return self.model.create(user);
    }

    getUserByName(name) {
      let self = this;

      return self.model.findOne({ name: name })
    }
}

module.exports = new User();
