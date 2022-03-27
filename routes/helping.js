const express = require('express');
const app = express();
const mongoose = require('mongoose')
const registerRouter = require('./register')
const userModel = registerRouter.userModel;
let helpSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    materials: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
})
let helpModel = new mongoose.model('helpers', helpSchema);
exports.getHelpers = (req, res) => {
    helpModel.find({}, function(err, students) {
        console.log(students)
        res.render('student-help', {
            students: students,
            isLoggedIn: req.session.username,
        })
    }).sort({_id: -1})
}
exports.createCard = (req ,res) => {
    let name = req.session.username;
    let branch = req.body.branch;
    let materials = req.body.materials;
    let number = req.body.number;
    let level = req.body.level;
    let type = req.body.type;
    let location = req.body.location;
            let newHelper = new helpModel({
                name: req.session.username,
                branch: branch,
                materials: materials,
                number: number,
                level: level,
                type: type,
            })

                newHelper.save(function(err, Helper) {
                    if(err) {
                        res.send(err)
                    }
                    else {
                        res.redirect('/community/help')
                    }
                })
        
  

       
    
   
}
exports.helpModel = helpModel;