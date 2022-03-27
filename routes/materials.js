const express = require('express');
const app = express();
const mongoose = require('mongoose')
const summaryRouter = require('../routes/summaries')

let lessonsSchema = new mongoose.Schema({
    lessonName: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    date: {
        type: String
    }
})
let lessonModel = new mongoose.model('lessons', lessonsSchema)
exports.materials = (req, res) => {
    lessonModel.find({branch: req.params.branch, material: req.params.material}, function(err, doc) {
        if(err) {
           console.log(err)
        }
        if(req.session.username ==="khalil sammour") {
            res.render('materialLessonsadmin', {
                branch: req.params.branch,
                material :req.params.material,
                lesson: req.params.lesson,
                lessons: doc,
                isLoggedIn: req.session.username,
            })
        }
        else {
            res.render('materialLessons', {
                branch: req.params.branch,
                material :req.params.material,
                lesson: req.params.lesson,
                lessons: doc,
                isLoggedIn: req.session.username,
            })
        }
    }).sort({date: 1})
   

}
exports.materialsPost = (req ,res) => {
    let lesson = req.body.lessonTitle
    let newLesson = new lessonModel({
        branch: req.params.branch,
        lessonName: lesson,
        material: req.params.material,
        date: Date.now()
    })
    newLesson.save(function(err, doc) {
        res.redirect(`/${req.params.branch}/${req.params.material}`)
    })
}
exports.dopost = (req ,res) => {
    lessonModel.update({ branch: 'es', material: 'Biology'},{material: 'economics'},  function(err, save) {
        console.log(save)
    })
}
exports.lessonModel = lessonModel;