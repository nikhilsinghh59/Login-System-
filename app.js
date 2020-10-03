const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session  = require('express-session');
var memoryStore = require('memorystore')(session); // use memorystore to avoid memory leakage while session management
const passport = require('passport');

const app = express();

// Passport Config
require('./config/passport')(passport);

//Connect mongoose
mongoose.connect('mongodb://localhost:27017/loginApp',{useNewUrlParser : true})
.then(() => {
    console.log("MongoDB connected.");
})
.catch(err => {
    console.log(err);
});

//EJS
app.use(expressLayouts);
app.set('view engine' , 'ejs');

//Body Parser
app.use(express.urlencoded({extended : false}));


app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
      store : new memoryStore({   ///memorystore
        checkPeriod: 86400000
      }),
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


  // Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


//Routes
const routes = require('./routes/index');
const users = require('./routes/users');

//Set routes

app.use('/users' , users);
app.use('/' , routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT , console.log("Server started at port "+ PORT));