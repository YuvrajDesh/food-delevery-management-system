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
//Database connection
// const url = 'mongodb://localhost:27017/food';
// mongoose.connect(url);
// const connection = mongoose.connection;
// connection
//     .once('open', function () {
//       console.log('MongoDB running');
//     })
//     .on('error', function (err) {
//       console.log(err);
//     });

    // connection.once('open', () => {
    //     console.log('Database connected...');
    // }).catch(err => {
    //     console.log('Connection failed...')
    // });

    // before((done) => {
        mongoose.connect('mongodb://localhost:27017/food');
        const connection = mongoose.connection
        connection
        .once('open', () => { console.log("established connection"); })
        .on('error', (error) => {
          console.warn('Some error', error);
        });
    //   });

    //Session store
    let mongoStore =  MongoDBStore.create({
       mongoUrl: 'mongodb://localhost:27017/food',
        collection: 'sessions'
    })

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
app.listen(PORT,()=>{
    console.log(`Listening on port  ${PORT}`)
}
)