const express = require('express');
const months = require('months');
const app = express();
const mongoose = require('mongoose');
const materialRouter = require('./materials')
const shamelRouter = require('./shamel')
const userRouter = require('./register')

exports.getdashboard = (req, res) => {
    if(!req.session.username) {
        res.send('please log in to accesss this page')
    }
    else {
        var today = new Date();
        var month = today.getMonth();
        var year = today.getFullYear();
       daysInMonth = new Date(year, 3, 0).getDate();
       console.log(daysInMonth)
        userRouter.userModel.findOne({username: req.session.username} ,function(err, doc) {
            let userBranch = doc.branch
            console.log(userBranch.toLowerCase())
            materialRouter.lessonModel.find({branch: userBranch.toLowerCase()}, function(err, lessons) {
            shamelRouter.shamelModel.find({branch: userBranch.toLowerCase()}, function(err, shamels) {
                const date = new Date();

const day = date.getDate();
                console.log('this is the dat' + day)
                console.log(userBranch)
                if(userBranch === 'GS') {
                    res.render('dashboard', {
                        isLoggedIn: req.session.username,
                        user: doc,
                        branch: doc.branch,
                        branchLow: doc.branch.toLowerCase(),
                        tasks: doc.tasks,
                        days: daysInMonth,
                        today: day,
                        lessons: lessons,
                        shamels: shamels,
                        materials: [
                            'math',
                            'physics'
                        ]
                    })
                }
                if(userBranch === 'LS') {
                    res.render('dashboard', {
                        isLoggedIn: req.session.username,
                        branch: doc.branch,
                        branchLow: doc.branch.toLowerCase(),
                        tasks: doc.tasks,
                        user: doc,
                        today: day,
                        days: daysInMonth,
                        lessons: lessons,
                        shamels: shamels,
                        materials: [
                            'biology',
                            'physics'
                        ]
                    })
                }
            })
            }).sort({material: 1})
          
        })
    }
}
/*
   if(doc.branch === 'gs') {
                console.log(doc)
                res.render('dashboardgs')
            }
             if(doc.branch === 'es') {
                res.render('dashboardes')
                console.log(doc.branch)

            }
             if(doc.branch == 'ls') {
                res.render('dashboardls')
                console.log(doc.branch)

            }
*/
exports.postdashbiard = (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const username = req.session.username;
    let newMission = new missionModel
}
exports.task = (req, res) => {
    const task = req.body.task;
    const shamel = req.body.shamel;
    const day = req.body.day;
    const lesson = req.body.lesson;
    const material = req.body.material;
    const month = req.body.month;
    userRouter.userModel.findOne({username: req.session.username}, function(err, doc) {
        console.log('user' +     doc)
    })
    userRouter.userModel.updateMany({_id: req.session.identifier} ,{$push: {tasks: {task: task, day: day, month: month, lesson: lesson, shamel: shamel, material: material}}}, function(err, doc) {
        console.log('doc' + doc)
        res.redirect('/dashboard')
    })
}