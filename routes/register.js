const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const passport = require('passport');
app.use( express.static( "public" ) );
const summaryRouter = require('./summaries')
const summaryModel = summaryRouter.summaryModel
const storage = multer.diskStorage({
    destination: './public/profiles',
    filename: function(req, file, cb){
      cb(null, file.originalname); 
    },
  
  });
  const upload = multer({
    storage: storage,
    limits:{fileSize: 500000},
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(`only images are accepted:jpg - jpeg - png/contact us if you have any problem`+ ' <a href="/">Contact Us</a> ' );
        }
      }
    
}).single('myImage');
let reviewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    }
})
let tasksSchema = new mongoose.Schema({
    task: {
        type: String,
    },
    lesson: {
        type: String
    },
    material: {
        type: String
    },
    shamel: {
        type: String
    },
    day: {
        type: String,
    },
    month: {
        type: String,
    }
})
let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: 'no bio added'
    },
    branch: {
        type: String,
        default: 'GS'
    },
    birthday: {
        type: Number,
        default: '2004'
    },
    school: {
        type: String,
        
    },
    type: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'no image added'
    },
    price: {
        type: Number,
        default: ''
    },
    experience: {
        type: Number,
        default: ''
    },
    certificate: {
        type: String,
        default: ''
    },
    materials: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    number: {
        type: Number,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    facebook: {
        type: String,
        default: ''

    },
    instagram: {
        type: String,
        default: ''

    },
    points: {
        type: Number,
        default: 0,
    },
    tasks: [tasksSchema],
    reviews: [reviewSchema]
})

/**
 * Password hash middleware.
*/
userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

let userModel = new mongoose.model('users', userSchema);
exports.main = (req, res) => {
    userModel.findOne({_id: req.session.identifier}, function(err, user) {
        if(user.type == 'teacher') {
            res.render('mainteacher')
        }
        else {
            res.render('students-main', {
                isLoggedIn: req.session.username
              });
        }
    })
}
exports.registerStudentPost =  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const bio = req.body.bio;
    const email = req.body.email;
    const branch = req.body.branch;
    const school = req.body.school;
    let newUser = new userModel({
        username: username,
        name: name,
        bio: bio,
        school: school,
        email: email,
        password: password,
        type: 'student',
        branch: branch,
    })
    userModel.findOne({username: newUser.username}, function(err, doc) {
        if(err) {
            console.log(err)
        }
        if(doc !== null) {
            res.send('username taken')
        }
        else {
            userModel.findOne({email: newUser.email}, function(err, email) {
                if(email!== null) {
                    res.send('تم استخدام هذا الاياميل قبل بمرة')
                }
                else {
                    newUser.save(function(err, user) {
                        if(err){ return next(err)}
                        res.redirect('/login')
            })
            let transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                  user: 'iam.terminal@hotmail.com', // generated ethereal user
                  pass: 'khalilsammour555', // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false,
                }
              });
            let info =  transporter.sendMail({
                from: '"Fred Foo 👻" <iam.terminal@hotmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: "أهلا و سهلا بكم في موقعنا", // Subject line
                text: "نحن أكبر من موقع،نحن مجتمع لجميع طلاب الترمينا", // plain text body
                html: "<b>Welcome-Have A Good Time</b>", // html body
              });
                }
            })
            
        }
    })
}
exports.registerTeacherPost =  (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    const username = req.body.username;
    const password = req.body.password;
    const price = req.body.price;
    const materials = req.body.materials;
    const certificate = req.body.certificate;
    const experience = req.body.experience;
    const location = req.body.location;
    const number = req.body.number;
    const email = req.body.email;
    const facebook = req.body.facebook;
    const instagram = req.body.instagram;
    let newUser = new userModel({
        name: name,
        bio: bio,
        username: username,
        type: "teacher",
        password: password,
        price: price,
        materials: materials,
        certificate: certificate,
        experience: experience,
        location: location,
        number: req.body.number,
        email: email,
        facebook: facebook,
        instagram: instagram,
    })
    console.log(req.body.number)
    userModel.findOne({username: username}, function(err, doc) {
  
        if(doc !== null) {
            res.send('username taken')
        }
       
        else {
            newUser.save(function(err, user) {
            
                
              
                    res.redirect('/login')
                
            })
        }
    })
}
exports.loginPost = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        req.logIn(user, (err) => {
            req.session.identifier = user.id;
            req.session.username = user.username;
            req.session.type = user.type;
            res.redirect('/profile')
        });
      })(req, res);
}

function points() {
    summaryModel.find({createdBy: req.sesion.username}, function(err, pointsForMe) {
        if(err) {
            res.send(err)
        }
        else {
            console.log(pointsForMe)
        }
    })
}

exports.profileGet = (req, res) => {
    if(!req.session.identifier) {
        res.send('you are not logged in')
    }
    if(req.session.username === 'khalil sammour') {
        userModel.findOne({username: req.session.username}, function(err, user) {
            if(req.session.type === 'teacher') {
                res.render('teacherprofile', {
                    user: user,
                    isLoggedIn: req.session.username,
    
                })
            }
            else {
                userModel.find({}, function(err, allusers) {
                    res.render('profile', {
                        user: user,
                        isLoggedIn: req.session.username,
                        allusers: allusers,
                    })
                }).sort({_id: -1})
                
            }
            })
    }
    else {
     
    userModel.findOne({username: req.session.username}, function(err, user) {
        if(req.session.type === 'teacher') {
            res.render('teacherprofile', {
                user: user,
                isLoggedIn: req.session.username,

            })
        }
        else {
            res.render('profile', {
                user: user,
                isLoggedIn: req.session.username,
            })
        }
        })
    
     
        
    }

}
exports.profileIMage = (req, res) => {
    upload(req, res, (err) => {
       
     
          userModel.updateOne({_id: req .session.identifier}, { image: req.file.originalname}, function(err, doc) {
             
                  res.redirect('/profile')
              
          })
       
        
      })
}
exports.profileEdit = (req, res) => {
    userModel.findOne({_id: req.session.identifier}, function(err, doc) {
        if(err) {
           console.log(err)
        }
        else  {
            res.render('profileEdit', {
                user: doc,
                isLoggedIn: req.session.username,
            })

        }
    })
}
exports.editProfilePost = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const branch = req.body.branch;
    const type = req.body.type;
    const bio = req.body.bio;
    userModel.updateOne({_id: req.session.identifier}, {username: username, password: password, branch: branch, type: type, bio: bio}, function(err, updated) {
        if(err) {
            res.redirect('/profile')
        }
        else {
            res.redirect('/profile')

        }
    })

}
exports.teachers = (req, res) => {
    userModel.find({type: 'teacher'}, function(err, teachers) {
        if(err) {
            console.log(err)
        }
        else {
            res.render('privateTeachers', {
                teachers: teachers,
                isLoggedIn: req.session.username,
            })
        }
    })
}
exports.teachersInfo = (req, res) => {
    const price = req.body.price;
    const experience = req.body.experience;
    const certificate = req.body.certificate;
    const materials = req.body.materials;
    userModel.updateOne({})
}
exports.viewTeacher = (req, res) => {
    userModel.findOne({type: 'teacher', username: req.params.teacherName}, function(err, teacher) {
        if(err) {
            console.log(err)
        }
        else {
            res.render('viewTeacher', {
                teacher: teacher,
                isLoggedIn: req.session.username,
                reviews: teacher,

            })
        }
    })
}
exports.viewprofiles = (req, res) => {
    userModel.findOne({username: req.params.user}, function(err, user) {
        if(err) {
            res.send(err)
        }
        if(user === null) {
            res.send('no such user on this website')
        }
      
        else {
            summaryModel.find({createdBy: req.params.user}, function(err, summaries) {
                res.render('viewprofile', {
                    user: user,
                    isLoggedIn: req.session.username,
                    summaries: summaries,
                })
            })
       
        }
    })
}

exports.leaderboard = (req ,res) => {
    userModel.find({}, function(err, board) {
        res.render('board', {
            topusers: board,
            isLoggedIn: req.session.username,

        })
    }).sort({points: -1}).limit(5)
}
exports.profileTeacherEdit = (req, res) => {
    if(!req.session.identifier) {
        res.send('login first')
    }
    else {
    userModel.findOne({_id: req.session.identifier}, function(err, user) {
        res.render('editTeacher', {
            user: user,
            isLoggedIn: req.session.username,

        })
    })
}
}
exports.editProfileTeacherPost = (req ,res) => {
    const password = req.body.password;
    const bio = req.body.bio;
    const price = req.body.cost;
    const experience = req.body.experience;
    const certificate = req.body.certificate;
    const materials = req.body.materials;
    userModel.updateOne({_id: req.session.identifier}, { password: password, bio: bio, price: price, experience: experience, certificate: certificate, materials: materials}, function(err, updated) {
        if(err) {
            res.redirect('/profile')
        }
        else {
            res.redirect('/profile')
        }
        })

}
exports.phone = (req, res) => {
    const number  = req.body.number;
    userModel.updateOne({username: req.session.username}, {number: number}, function(err, doc) {
        res.redirect('/profile')
    })

}
exports.do = (req, res) => {
    userModel.findOne({username: 'daniFakih'}, function(err, updated) {
    
      res.render('dowhat', {
          user: updated
      })
    
    })
  }
exports.reviewTeacher = (req, res) => {
    let review = req.body.review;
    let type = req.body.type;
    userModel.findOne({_id: req.params.id}, function(err, user) {
        userModel.updateOne({type: 'teacher', _id: req.params.id}, {$push: {reviews: {review: review, type: type, username: req.session.username}}}, function(err, review) {
            res.redirect(`/teachers/${user.username}`)
        })
    })
    
}
exports.userModel = userModel