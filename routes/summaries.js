const express = require('express');
const app = express();
const mongoose = require('mongoose')
const multer = require('multer')
const register = require('./register')
const router = express.Router();
const lessonModel = require('./materials')
const userRouter = require('./register')
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use( express.static( "public" ) );
app.use(express.static(__dirname + '/public'));
let imageSchema = new mongoose.Schema({
  imageName: {
    type: String,
  },
  tag: {
    type: String,
  }
})
let replySchema = new mongoose.Schema({
  reply: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
})
let commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  replies: [replySchema]
})
let endorseSchema = new mongoose.Schema({
  endorsment: {
    type: String
  },
  username: {
    type: String
  },
})
let summarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'no description added',
  },
  branch: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  lesson :{
    type: String,
    required: true
  },
  createdBy: {
    type: String,
  },
  rate: {
    type: Number,
    default: '2.5'
  },
  views: {
    type: Number,
    default: '1',
  },
  endorses: [endorseSchema],
  imageNames: [imageSchema],
  comments: [commentSchema]
})
const commentModel = new mongoose.model('comments', commentSchema)
const summaryModel = new mongoose.model('summaries', summarySchema)
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
    destination: './public/summaries',
    filename: function(req, file, cb){
      const value = []
      let variable = makeid(10);
      value.push(variable)
      const filezName =   file.originalname;
      cb(null,makeid(10) +  filezName  );
    },
  
  });
  
  const upload =  multer({
    storage: storage,
    limits:{fileSize: 10000000},
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          console.log(file)
          return cb(`only images are accepted:jpg - jpeg - png/contact us if you have any problem`+ ' <a href="/">Contact Us</a> ' );
        }
      }
    
  }).array('myImage', 200);
  exports.addTag = (req ,res) => {
    summaryModel.findOneAndUpdate({_id: req.params.id, "imageNames.imageName": req.params.imageId},  {$set: {"imageNames.$.tag": req.body.tag} }, function(err, doc) {
      console.log('done')
    })
    
  }
  exports.summaryGet = (req, res) => {
    console.log(req.params)
    summaryModel.find({branch: req.params.branch, material: req.params.material, lesson: req.params.lesson}, function(err, images) {
      if(err) {
        console.log(err)
      }
      else {
      
            res.render('lesson-summaries', {
              images: images,
              imagesNames: images.imageName,
              branch: req.params.branch,
              material: req.params.material,
              lesson: req.params.lesson,
              title: req.params.summary,
              isLoggedIn: req.session.username,
            })
          }
    }).sort({rate: -1})
  }

  exports.summaryDescriptionPost = (req, res) => {
    if(!req.session.identifier) {
      res.send('Please LogIn To Post Your Summary')
    }
    else {
    const title = req.body.title;
    const description = req.body.description;
    const material = req.params.material;
    const branch = req.params.branch;
    const lesson = req.params.lesson;
    let newSummary = new summaryModel({
      title: title,
      description: description,
      material: material,
      branch: branch,
      lesson: lesson,
      createdBy: req.session.username,
    })
      const user = userRouter.userModel;

    summaryModel.findOne({title: title, lesson: lesson, material: material, branch: branch}, function(err, found) {
      if(err) {
        res.send(err)
      }
      if(found) {
        res.send('taken')
      }
      else {
         userRouter.userModel.updateOne({username: req.session.username}, { $inc: { points: '1' } }, function(err, users) {
          console.log(users)
        })
        newSummary.save(function(err, doc) { 
          res.redirect(`/${req.params.branch}/${req.params.material}/:${req.params.lesson}/${title}/summaryPost`);

        })
      }
    })
    }
 
  }
  exports.summaryGetFiles = (req, res) => {
    if(!req.session.identifier) {
      res.send('please login to add your summary')
    }
    summaryModel.findOne({createdBy: req.session.username, title: req.params.title}, function(err, doc) {
      if(err) {
        console.log(err)
      }
      if(doc === null) {
        res.send('You Cannot Edit This Post')
      }
      else {
        console.log(doc)
        res.render('summaries-file', {
          branch: req.params.branch,
          material: req.params.material,
          lesson: req.params.lesson,
          title: req.params.title,
          isLoggedIn: req.session.username,
        })
      }
    })
   
  }

  exports.summaryPost =   (req, res) => {
    upload (req,  res,  (err) => {   
          if(err) {
            res.send(err)
          }
           else {
            const filez = req.files
            var files = []
            
            for(const file of [...req.files])  {
              const filename = file.filename;
              console.log(file.originalname)
              files.push({imageName: filename});

             }
             const collator = new Intl.Collator();
             files.sort((a, b) => collator.compare(a.imageName.substring(10), b.imageName.substring(10)));
              
        
            console.log(files)
             summaryModel.updateMany({branch: req.params.branch, lesson: req.params.lesson, material: req.params.material, title: req.params.title}, {$push: {imageNames: files}}, function(err, doc) {
               res.redirect(`/${req.params.branch}/${req.params.material}/${req.params.lesson}`)
             })
             
          }
         
      })
}
exports.summaryViewGet = (req, res) => {
  summaryModel.updateOne({_id: req.params.id}, { $inc: {views: '1'} }, function(err, users) {
    console.log(users)
  })
  summaryModel.findOne({_id: req.params.id}, function(err, summary) {
    if(err) {
      console.log(err)
    }
    else {
      const n = summary
      userRouter.userModel.find({type: 'teacher', materials: summary.material }, function(err, teachers) {
        let replies = 'comments.replies'
        let images = summary.imageName;
        let theusername = req.session.username;
          res.render('view-summary', {
          summaries: summary.imageNames,
          summary: summary,
          comments: summary.comments,
          endorsements: summary.endorses,
          replies: 'comments.replies',
          description: summary.description,
          isLoggedIn: req.session.username,
          teachers: teachers,
        })
      }).sort({points: -1}).limit(3)
      
    }
  }).sort({_id: 1})
}
exports.summaryViewGetTags = (req, res) => {
  summaryModel.updateOne({_id: req.params.id}, { $inc: {views: '1'} }, function(err, users) {
    console.log(users)
  })
  summaryModel.findOne({_id: req.params.id}, function(err, summary) {
    if(err) {
      console.log(err)
    }
    else {
      const n = summary
      userRouter.userModel.find({type: 'teacher', materials: summary.material }, function(err, teachers) {
        let replies = 'comments.replies'
        let images = summary.imageName;
        let theusername = req.session.username;
          res.render('view-summary', {
          summaries: summary.imageNames,
          summary: summary,
          comments: summary.comments,
          endorsements: summary.endorses,
          replies: 'comments.replies',
          description: summary.description,
          isLoggedIn: req.session.username,
          teachers: teachers,
        })
      }).sort({points: -1}).limit(3)
      
    }
  }).sort({_id: 1})
}

  exports.summariesMaterials = (req, res) => {
    summaryModel.find({brnach: req.params.branch, material: req.params.material}, function(err, doc)  {
      if(err) {
        console.log(err)
      }
      else {
          res.render('material', {
              material: req.params.material,
              branch: req.params.branch,
              lessons: req.params.lesson,
              lessons: doc,
              isLoggedIn: req.session.username,
          })
      }
  })
};
exports.comment = (data) => {
  summaryModel.findOne({_id: data.data.summaryId}, (err, summary) => {
    if(err){ console.log(err)
      return err
    }
    if(summary.comments == null){
      summary.comments = []
    }
    summary.comments.push(new commentModel({
      comment: data.data.comment,
      username: data.data.username
    }))
    summary.comments.forEach((element) => {
      if(!element.username){
        summary.comments.splice(summary.comments.indexOf(element),1)
      }
    })
    summary.save(err => {
      return err
    })
  });
}
exports.reply = (req, res) => {
  var reply = req.body.reply;
  summaryModel.updateOne({_id: req.params.id}, {$push: {comments: {replies: {reply: reply, username: req.session.username}}}}, function(err, doc) {
    if(err) {
      res.send(err)
    }
    else {
      res.redirect(`/summary/${req.params.id}`)
      
    }
  })
}
exports.summarygetcalendar = (req, res) => {
  summaryModel.findOne({branch: req.params.branch,material: req.params.material,lesson: req.params.lesson}, function(err, summary) {
    if(summary == null) {
      res.send('so explanations for this lesson yet, we are sorry brother')
    }
    else {
    res.render('view-summary', {
      summaries: summary.imageNames,
      summary: summary,
      comments: summary.comments,
      replies: 'comments.replies',
      description: summary.description,
      isLoggedIn: req.session.username,
    })
  }
  }).sort({rate: -1})
}
exports.endorse = (req, res) => {
  if(!req.session.identifier) {
    res.send('login')
  }
  else {
    console.log('helooooooooooooooo')
    userRouter.userModel.findOne({_id: req.session.identifier}, function(err, user) {
      if(user.type != 'teacher') {
        res.send('only teachers can do this function')
      }
      else {
        let username = req.session.username;
        summaryModel.updateOne({_id: req.params.id},  {$push: {endorses: {endorsment: 'true', username: `${username}`}}}, function(err, save) {
          res.redirect(`/summary/${req.params.id}`)
        })
      }
    })
  
  }

}

exports.deleteSumamry = (req, res) => { 
  console.log('test');
}
exports.summaryModel = summaryModel;


