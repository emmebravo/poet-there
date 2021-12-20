const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 4000;
const morgan = require('morgan'); //morgan for login
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db.js');

//load config
dotenv.config({ path: './config/config.env' });

//passport config
require('./config/passport')(passport);

connectDB();

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method override
app.use(
  methodOverride(function (request, response) {
    if (
      request.body &&
      typeof request.body === 'object' &&
      '_method' in request.body
    ) {
      //look in urlencoded POST bodies and delete it
      let method = request.body._method;
      delete request.body._method;
      return method;
    }
  })
);

//this only for dev mode; when a request is made it shows in the console
if (process.env.NODE_DEV === 'development') {
  app.use(morgan('dev'));
}

//Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs');

//Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
); //tells engine type of file extension?
app.set('view engine', '.hbs');

// Sessions middleware (always above passport)
app.use(
  session({
    secret: 'swiffer',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global variable
app.use(function (request, response, next) {
  response.locals.user = request.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
