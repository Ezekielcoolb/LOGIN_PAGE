const express = require ('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
//  for flash messages bring in flash
const flash = require('connect-flash')
const session = require('express-session')
// const passport = require('./config/passport')
const passport =require('passport')


const app = express()
const PORT = process.env.PORT || 5000

// passport config
require('./config/passport')(passport)
// DB Config
const db = require('./config/keys').MongoURI

// connect to Mongo

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err))
// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')


// BodyParser( to get values fromform with req.body)
app.use(express.urlencoded({ extended: false }))

//  Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }))

  // Passport middleware (this must be after session middleware)
  app.use(passport.initialize())
  app.use(passport.session())

//   Connect flash
app.use(flash())

//  Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
}) 

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


app.listen(PORT,
    console.log(`Server started on port ${PORT}`))