require('dotenv').config()
// Create Express server:-
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-Layouts');
const passport = require('passport') // Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. 

const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')
const Emitter = require('events')



// Database connection:-
mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
  // we're connected!
  console.log("Mongoose connected!")
});


// Session store:-
// let mongoStore = new MongoDbStore({
//                  mongooseConnection: connection,
//                  collection: 'session'
// })

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)



// Seesion Config:- Note: Session work as a middileware so if u use express middileware then simply type app.use(middliware name)
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: MongoDbStore.create({ client: connection.getClient() }),
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
// Note: Session never work without cookies. it is necessary to encrypte cookies so we need secret key.

//Passport Config:-Note: Always Passport config put after Session config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// Express-flash Config:- Flash is an extension of connect-flash with the ability to define a flash message and render it without redirecting the request.
app.use(flash())


// Assets:-
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false })) // for urlencoded data like register data
app.use(express.json()) // to receive json data

// Gobal middleware:- To import session on cartCounter(layout.ejs)
app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()

})


// Set template Engine:-
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');



// routes:-[Note: Always make sure these routes are come after template Engine.]
require('./routes/web')(app) // to pass app object
app.use((req, res)=>{
  res.status(404).render('errors/404')
})




const server = app.listen(PORT, (req, res) => {
  console.log(`My server running at ${PORT}`)
})


// Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})