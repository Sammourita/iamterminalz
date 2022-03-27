const express = require('express');
const app = express();
const multer = require('multer')
const registerRouter = require('./register')
const mongoose = require('mongoose')
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
   }
   return result;
  }
const storage = multer.diskStorage({
    destination: './public/questions',
    filename: function(req, file, cb){
        const filezName =   file.originalname;
        cb(null,   makeid(10) + filezName  );
    },
  
  });
  const upload = multer({
    storage: storage,
    limits:{fileSize: 500000000},
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"|| file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(`only images are accepted:jpg - jpeg - png/contact us if you have any problem`+ ' <a href="/">Contact Us</a> ' );
        }
      }
    
}).single('myImage');
let answerSchema = new mongoose.Schema ({
    answer: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
})
let questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    lesson: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    answers: [answerSchema] 
})
let questionModel = new mongoose.model('questions', questionSchema)
exports.questionpage = (req, res) => {
    questionModel.find({branch: req.params.branch, material: req.params.material, lesson: req.params.lesson}, function(err, questions) {
        console.log(questions.answers)
        res.render('questions', {
            questions: questions,
            material: req.params.material,
            branch: req.params.branch,
            lesson: req.params.lesson,
            answers: questions.answers,
        })

    }).sort({_id: -1})
}
exports.questionpostdouble = async (req, res) => {
    console.log('file' +  req.files);
        let branch  = req.params.branch;
        let lesson  = req.params.lesson;
        let material = req.params.material;
        await upload(req, res, (err) => {
        if( req.file !== undefined) {       
                console.log('file' + req.file)         
                let newQuestion = new questionModel({
                    username: req.session.username,
                    question: req.params.question,
                    material: req.params.material,
                    lesson: req.params.lesson,
                    branch: req.params.branch,
                    image: req.file.filename,
                })
            console.log('file' + req.file)
            newQuestion.save(function(err, doc) {
                if(err) {
                    res.send(err)
                }
                else {
                    res.redirect(`/${branch}/${material}/${lesson}/questions`)
                }
            })
  
        }
  else {   
        let newQuestion = new questionModel({
            username: req.session.username,
            question: req.params.question,
            material: req.params.material,
            lesson: req.params.lesson,
            branch: req.params.branch,
        })
        console.log('file' + req.file)
        newQuestion.save(function(err, doc) {
            if(err) {
                res.send(err)
            }
            else {
                res.redirect(`/${branch}/${material}/${lesson}/questions`)
            }
        })
        
    }
})

  

    
}
exports.questionpostsingle = async (req, res) => {
    const question = req.body.question;
    const material = req.params.material;
    const branch = req.params.branch;
    const lesson = req.params.lesson;
        console.log('done')
        let newQuestion = new questionModel({
            username: req.session.username,
            question: req.body.question,
            material: material,
            lesson: lesson,
            branch: req.params.branch,
        })
        newQuestion.save(function(err, doc) {
            if(err) {
                res.send(err)
            }
            else {
                res.redirect(`/${branch}/${material}/${lesson}/questions`)
            }
        })
    
    
}
exports.answerPost =  (req, res) => {
    const username = req.session.username;
    const question = req.params.question;
    const answer = req.body.answer;
    const branch = req.params.branch;
    const lesson = req.params.lesson;
    const material = req.params.material;
    console.log('test')
    questionModel.updateOne({branch: branch, lesson: lesson, material: material, _id: question}, {$push: {answers: {answer: answer, username: username, }}}, function(err, doc) {
        if(err) {
            res.send(err)
        }
        else {
            registerRouter.userModel.findOne({_id: req.session.identifier}, function(err, user) {
                registerRouter.userModel.updateOne({username: username}, { $inc: { points: '1' } }, function(err, users) {
                    console.log(users)
                  })
                if(user.type == 'teacher') {
                    res.redirect('/questionsforme')
                }
                else {
                    console.log(branch + lesson + material + question)
                    res.redirect(`/${branch}/${material}/${lesson}/questions`)
                }
            })
  
        }
    })

    }
exports.answerPostdouble = async (req, res) => {
    const username = req.session.username;
    const question = req.params.question;
    const answer = req.body.answer;
    const branch = req.params.branch;
    const lesson = req.params.lesson;
    const material = req.params.material;
    console.log('test')
    await upload(req, res, (err) => {
        if( req.file !== undefined) {       
    questionModel.updateOne({branch: branch, lesson: lesson, material: material, _id: question}, {$push: {answers: {answer: req.body.answer, username: username, image: req.file.filename}}}, function(err, doc) {
        if(err) {
            res.send(err)
        }
        else {
            registerRouter.userModel.findOne({_id: req.session.identifier}, function(err, user) {
                registerRouter.userModel.updateOne({username: username}, { $inc: { points: '1' } }, function(err, users) {
                    console.log(users)
                  })
                if(user.type == 'teacher') {
                    res.redirect('/questionsforme')
                }
                else {
                    console.log(branch + lesson + material + question)
                    res.redirect(`/${branch}/${material}/${lesson}/questions`)
                }
            })
  
        }
    })
}
else {
    questionModel.updateOne({branch: branch, lesson: lesson, material: material, _id: question}, {$push: {answers: {answer: req.body.answer, username: username}}}, function(err, doc) {
        if(err) {
            res.send(err)
        }
        else {
            registerRouter.userModel.findOne({_id: req.session.identifier}, function(err, user) {
                registerRouter.userModel.updateOne({username: username}, { $inc: { points: '1' } }, function(err, users) {
                    console.log(users)
                  })
                if(user.type == 'teacher') {
                    res.redirect('/questionsforme')
                }
                else {
                    console.log(branch + lesson + material + question)
                    res.redirect(`/${branch}/${material}/${lesson}/questions`)
                }
            })
  
        }
    })
}
    })
}
exports.teacherquestionsboard = (req, res) => {
    registerRouter.userModel.findOne({_id: req.session.identifier},function(err, teacher) {
        if(teacher.type != 'teacher')  {
            res.send('this page is made for teachers only')
        }
        else {
            questionModel.find({material: teacher.materials}, function(err, questions) {
                res.render('questionsforteachers', {
                    questions: questions,
                })
            }).sort({_id: -1})
        }
    })
}
exports.viewquestion = (req, res) => {
    questionModel.findOne({branch: req.params.branch, material: req.params.material, lesson: req.params.lesson, _id: req.params.id}, function(err, question) {
        res.render('viewquestion', {
            question: question,
            isLoggedIn: req.session.identifier,
        })
    })
}