const express = require('express');
const app = express();
const https = require('https');
const session = require('express-session')
const multer = require('multer');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const fs = require('fs')
const bodyParser = require('body-parser');
const registerRouter = require('./routes/register')
const dashboardRouter  = require('./routes/dashboard')
const communityRouter = require('./routes/community')
const questionRouter = require('./routes/questions')
const shamelRouter = require('./routes/shamel')
const helpRouter = require('./routes/helping')
const path = require('path');
const summaryRouter = require('./routes/summaries')
const materialRouter = require('./routes/materials')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use( express.static( "public" ) );
const passport = require('passport');
const passportConfig = require('./config/passport');
const webpush = require('web-push')
const config = require('config')
const publickey = config.get('vapid.public')
const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}
const server = https.createServer(httpsOptions,app);
const io = require('socket.io')(server)
const privatekey = config.get('vapid.private')
webpush.setVapidDetails('mailto:khalil.almortada@hotmail.com',publickey,privatekey)
app.use(session({
  secret: 'this is secret hhahahahahahaha $$$$$$%TYUI@UYTR@TYUI$IUYT#Y#UIO skjadbaskdsbdkjas askjdb askjdas bkdasndaslk isdavsd21371526381293621 1293y2 1921e isahdb 021 de 9ewdg3bd932qd',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://developers:justfordevelopers@developerz.mbxgr.mongodb.net/developing?retryWrites=true&w=majority',
    autoRemove: 'disabled'
  }),
  cookie: ({
    maxAge: 100*60*60*10000
  })
}))
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


const PORT = process.env.PORT || 5555;
mongoose.connect('mongodb+srv://developers:justfordevelopers@developerz.mbxgr.mongodb.net/developing?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true 
})
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

var counter = 0;
app.get('/', (req, res ) => {

 if(!req.session.identifier) {
  summaryRouter.summaryModel.find({}, function(err, summaries) {
  summaryRouter.summaryModel.find({branch: 'gs'}, function(err, gs) {
    summaryRouter.summaryModel.find({branch: 'ls'} , function(err, ls ) {
      summaryRouter.summaryModel.find({branch: 'es'} , function(err, es ) {
        registerRouter.userModel.find({}, function(err, doc) {
          registerRouter.userModel.find({type: 'teacher'}, function(err, teachers) {
            console.log(doc.length)
            counter++;
            res.render('index', {
              isLoggedIn: req.session.username,
              counter: counter,
              doc: doc.length,
              summaries: summaries.length,
              gs: gs.length,
              ls: ls.length,
              es: es.length + 20,
              teachers: teachers,
              teachersnumber: teachers.length,
            })
          }).sort({points: -1}).limit(3)
         
        })
      })
    })
  })
  
  })
}
else {
    res.redirect('/main')
  
}
 
 
})
app.get('/about', (req, res) => {
  res.render('aboutus')
})
app.get('/pdf-viewer', (req, res) => {
  res.render('pdf-viewer')
})
app.get('/gs', (req, res ) => {
  res.render('gs', {
    isLoggedIn: req.session.username,
    materials: [
      'arabic',
      'english',
      'physics',
      'chemistry',
      'math',
      'civilization',
      'history',
      'geography',
      'philosophy'
    ],
    
  })
})
app.get('/community/tips', (req ,res) => {
  res.render('communitystudytips')
})
app.get('/community/tips/summarise', (req, res) => {
  res.render('./study-tips-community/summarize')
})
app.get('/community/tips/memorise', (req, res) => {
  res.render('./study-tips-community/memorise')
})
app.get('/community/tips/pomodoro', (req, res) => {
  res.render('./study-tips-community/pomodoro')
})
app.get('/community/tips/time', (req, res) => {
  res.render('./study-tips-community/time')
})
app.get('/community/tips/focus', (req, res) => {
  res.render('./study-tips-community/focus')
})
app.get('/community/tips/revision', (req, res) => {
  res.render('./study-tips-community/revision')
})
app.get('/community/tips/quiz', (req, res) => {
  res.render('./study-tips-community/quiz')
})
app.get('/community/help', helpRouter.getHelpers)
app.post('/community/help/create', helpRouter.createCard)
app.get('/shamel/:branch/:material', shamelRouter.getMaterial)
app.get('/shamel/:branch/:material/:year', shamelRouter.getPdf)
app.post('/:branch/:material/add', shamelRouter.postDawra)
app.get('/signup', (req, res) => {
  if(req.session.identifier) {
    res.redirect('/main')
  }
  else { 
  res.render('signupmain')
  }
})
app.get('/chat', (req, res) => {
  res.render('chat', {
    isLoggedIn: req.session.username,

  })
})
app.get('/signup/student', (req, res) => {
  if(req.session.identifier) {
    res.redirect('/main')
  }
  else {
  res.render('signup')
  }
})
app.get('/signup/teacher', (req, res) => {
  if(req.session.identifier) {
    res.redirect('/main')
  }
  else {
    res.render('signupTeacher')

  }
})
app.get('/login', (req, res) => {
  if(req.session.identifier) {
    res.redirect('/')
  }
  else {
  res.render('login')
  }
})


app.get('/ls', (req, res ) => {
  res.render('ls', {
    isLoggedIn: req.session.username,
    materials: [
      'arabic',
      'english',
      'physics',
      'chemistry',
      'math',
      'Biology',
      'civilization',
      'history',
      'geography',
      'philosophy'
    ],
    
  })
})
app.get('/lh', (req, res ) => {
  res.render('lh', {
    isLoggedIn: req.session.username,
  })
})
app.get('/es', (req, res ) => {
  res.render('es', {
    isLoggedIn: req.session.username,
    materials: [
      'arabic',
      'english',
      'physics',
      'chemistry',
      'math',
      'Biology',
      'sociology',
      'history',
      'geography',
      'philosophy',
      'economics',
      'civilization',
    ],
    
  })
})
app.get('/main', (req, res) => {
  if(!req.session.identifier) {
    res.render('students-main', {
      isLoggedIn: req.session.username
    }); 
  }
  else {
  registerRouter.userModel.findOne({_id: req.session.identifier}, function(err, user) {
    if(user.type === 'teacher') {
      res.render('mainteacher', {
        isLoggedIn: req.session.username
      });
    }
    else {
      res.render('students-main', {
        isLoggedIn: req.session.username
      }); 
    }
  })
}
 
})
app.get('/:branch/:material/:lesson/viewquestion/:id', questionRouter.viewquestion)
app.get("/worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public","js", "worker.js"));
});
app.get('/dashboard', dashboardRouter.getdashboard)
app.post('/task', dashboardRouter.task)
app.get('/features', (req, res) => {
  res.render('features')
})
app.get('/branches', (req ,res) => {
  res.render('branches')
})
app.get('/community', communityRouter.communityGet)
app.get('/community/express', communityRouter.eventGet)
app.post('/express', communityRouter.postExpress)
//get requests
app.get('/questionsforme', questionRouter.teacherquestionsboard)
app.get('/questionsforme/:id', (req, res) => {
  res.redirect('/questionsforme')
})
app.post('/summary/:id/:imageId/tag', summaryRouter.addTag)

app.get('/:branch/:material/:lesson/questions', questionRouter.questionpage)
app.post('/:branch/:material/:lesson/questions/:question/post', questionRouter.questionpostdouble)
app.post('/:branch/:material/:lesson/:question/answer/post', questionRouter.answerPost)
app.post('/:branch/:material/:lesson/:question/answer/postdouble', questionRouter.answerPostdouble)
app.get('/teachers/:teacherName', registerRouter.viewTeacher)
app.get('/profile', registerRouter.profileGet)
app.get('/edit-profile', registerRouter.profileEdit)
app.get('/edit-teacher', registerRouter.profileTeacherEdit)
app.post('/teacher/:id/review', registerRouter.reviewTeacher)
app.get('/privateTeacher', registerRouter.teachers)
app.get('/summary/:id', summaryRouter.summaryViewGet)
app.get('/summary/:id/tags', summaryRouter.summaryViewGetTags)
app.get('/ls/arabic', (req, res) => {
  res.redirect('/gs/arabic')
})
app.get('/ls/civilization', (req, res) => {
  res.redirect('/gs/civilization')
})
app.get('/es/civilization', (req, res) => {
  res.redirect('/gs/civilization')
})
app.get('/ls/english', (req, res) => {
  res.redirect(`/gs/english`)
})
app.get('/es/english', (req, res) => {
  res.redirect(`/gs/english`)
})
app.get('/ls/philosophy', (req, res) => {
  res.redirect(`/gs/philosophy`)
})
app.get('/es/philosophy', (req, res) => {
  res.redirect(`/gs/philosophy`)
})
app.get('/ls/geography', (req, res) => {
  res.redirect('/gs/geography')
})
app.get('/ls/history', (req, res) => {
  res.redirect('/gs/history')
})
app.get('/es/history', (req, res) => {
  res.redirect('/gs/history')
})

app.get('/es/geography', (req, res) => {
  res.redirect('/gs/geography')
})
app.get('/gs/chemistry/:lesson', (req, res) => {
  res.redirect(`/ls/chemistry/${req.params.lesson}`)
})
app.post('/delete/:id', summaryRouter.deleteSumamry)
app.post('/summary/:id/endorse', summaryRouter.endorse)
app.get('/users/:user', registerRouter.viewprofiles)
app.get('/:branch/:material', materialRouter.materials)

app.get('/:branch/:material/:lesson', summaryRouter.summaryGet)
app.get('/:branch/:material/:lesson/calendar', summaryRouter.summarygetcalendar)
app.get('/:branch/:material/::lesson/:title/summaryPost', summaryRouter.summaryGetFiles)
app.get('/:branch/:material/:lesson/viewsummaries', summaryRouter.summariesMaterials)
//post requests
//app.post('/summary/:id/comment', summaryRouter.comment);
app.post('/summary/:id/reply', summaryRouter.reply);
app.post('/signup-student', registerRouter.registerStudentPost)
app.post('/signup-teacher', registerRouter.registerTeacherPost)
app.post('/login', registerRouter.loginPost)
app.post('/:branch/:material', materialRouter.materialsPost)
app.post('/:branch/:material/:lesson/description/post', summaryRouter.summaryDescriptionPost)
app.post('/:branch/:material/:lesson/:title/summary', summaryRouter.summaryPost)
app.post('/profilePhoto', registerRouter.profileIMage)
app.post('/edit-profile', registerRouter.editProfilePost)
app.post('/edit-teacher', registerRouter.editProfileTeacherPost)
app.get('/Top-Users', registerRouter.leaderboard)
app.post('/phone', registerRouter.phone)
app.get('/logout', (req, res) => {
  if(!req.session.identifier) {
    res.render('loginfirst')
  }
  else {
    req.session.destroy();
    res.redirect('/')
  }
})
app.get('/*', (req ,res) => {
  res.render('error')
})

io.on('connection', socket => {
  console.log('Some client connected')
  socket.on('join', function(room) {
    socket.join(room);
    console.log(room);
  });
  socket.on('comment', data =>  {
    summaryRouter.comment(data)
    socket.to(data.summaryId).emit('commented', data)
  })
})
// Subscribe to the server worker 
app.post('/subscribe', (req, res)=>{
  //get push subscription object from the request
  const subscription = req.body;

  //send status 201 for the request
  res.status(201).json({})

  //create paylod: specified the detals of the push notification
  const payload = JSON.stringify({title: 'Push test'});

  //pass the object into sendNotification fucntion and catch any error
  webpush.sendNotification(subscription, payload).catch(err=> console.error(err));
})
app.listen(process.env.PORT || 5555, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});