require('dotenv').config({path:'./.env'});
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const res = require('express/lib/response');
const p  = require('path');
const app = express();
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDBStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')
//Database connection
        mongoose.connect('mongodb://localhost:27017/food');
        const connection = mongoose.connection
        connection
        .once('open', () => { console.log("established connection"); })
        .on('error', (error) => {
          console.warn('Some error', error);
        });
   
    //Session store
    let mongoStore =  MongoDBStore.create({
       mongoUrl: 'mongodb://localhost:27017/food',
        collection: 'sessions'
    })

    // Event emitter 
     const eventEmitter = new Emitter()
     app.set('eventEmitter', eventEmitter)

    // Session config
    app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false, 
        store: mongoStore,
        saveUninitialized: false, 
        cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour ,
       
    }))

    // Passport config 
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
    app.use(flash())
// assets
app.use(express.static('public'))
app.use(express.urlencoded({
    extended : false
}))
app.use(express.json())

// Global middleware 
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})
//set  template engine
app.use(expressLayout)
app.set('views',p.join(__dirname,'/resources/views'))
app.set('view engine','ejs')
require('./routes/web')(app)
const server = app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})

// Socket 

const io = require('socket.io')(server)
io.on('connection', (socket) => {

console.log(socket.id)
// Join  
socket.on('join', (orderId) => {
    console.log(orderId)
socket.join(orderId)
})
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
