let mongoose = require('mongoose');
let Promise = require('bluebird');
mongoose.Promise = Promise;
let config = require('../config/config.json');
let userSchema = require('./schema/user');
let articleSchema = require('./schema/article');

//promisify mongoose 
Promise.promisifyAll(mongoose.Model);
Promise.promisifyAll(mongoose.Model.prototype);
Promise.promisifyAll(mongoose.Query.prototype);

class Mongo{
    constructor() {
        let self = this;
        self.conn = null;
        self.models = {};

        self.init();
    }

    init() {
        let self = this;

        self.conn = mongoose.createConnection(config.mongodb);

        self.conn.on('connected', function(err){
            console.log('mongoose connected  error ' + err);
        });
    
        self.conn.on('error', function(err){
            console.log('mongoose throw error  error ' + err);
        });
    
        self.conn.on('disconnected', function(err){
            console.log('mongoose disconnected  error ' + err);
        });
    }

    getSchema(name) {
        let self = this;

        switch (name) {
            case 'user' :
                return userSchema;
            case 'article' :
                return articleSchema;    
        }
    }

    getModel(name) {
        let self = this;
        
        if (!self.models[name]) {
            self.models[name] = self.conn.model(name, self.getSchema(name));
        }

        return self.models[name];
    }

}

module.exports = new Mongo();





