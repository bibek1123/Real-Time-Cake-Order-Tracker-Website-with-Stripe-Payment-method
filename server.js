require('dotenv').config()
// Create Express server:-
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-Layouts');

const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')



// Database connection:-
mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  // we're connected!
  console.log("Mongoose connected!")
});


// Session store:-
// let mongoStore = new MongoDbStore({
//                  mongooseConnection: connection,
//                  collection: 'session'
// })


// Seesion Config:- Note: Session work as a middileware so if u use express middileware then simply type app.use(middliware name)
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: MongoDbStore.create({client:connection.getClient() }),
  saveUninitialized: false,
  cookie: {maxAge: 1000*60*60*24}
}));
// Note: Session never work without cookies. it is necessary to encrypte cookies so we need secret key.



// Express-flash Config:- Flash is an extension of connect-flash with the ability to define a flash message and render it without redirecting the request.
app.use(flash())


// Assets:-
app.use(express.static('public'))
app.use(express.json()) // to receive json data

// Gobal middleware:- To import session on cartCounter(layout.ejs)
app.use((req, res, next)=>{
  res.locals.session = req.session
  next()

})


// Set template Engine:-
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');



// routes:-[Note: Always make sure these routes are come after template Engine.]
require('./routes/web')(app) // to pass app object













app.listen(PORT, (req, res) => {
    console.log(`My server running at ${PORT}`)
})