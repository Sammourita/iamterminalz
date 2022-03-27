const express = require('express');
const app = express();
const mongoose = require('mongoose')
let expressSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        required: true,
        default: 'review',
    },
})
let expressModel = new mongoose.model('students expressing', expressSchema)
exports.communityGet = (req, res) => {
    res.render('community-main', {
        isLoggedIn: req.session.identifier
    })
}
exports.eventGet= (req, res) => {

    expressModel.find({}, function(err, expressions) {
        res.render('express2', {
            isLoggedIn: req.session.identifier,
            expressions: expressions
        })
    }).sort({_id: -1})
  
}
exports.postExpress = (req ,res) => {
    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const username = req.session.username;
    let  express = new expressModel({
        title: title,
        description: description,
        type: type,
        username: username,
    })
    express.save(function(err, doc) {
        res.redirect('/community/express')
    })
}