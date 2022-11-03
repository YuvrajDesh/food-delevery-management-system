const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const res = require('express/lib/response')
const p  = require('path')
const app = express()
const PORT = process.env.PORT || 3000

// assets
app.use(express.static('public'))
//set  template engine
app.use(expressLayout)
app.set('views',p.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

// app.get('/',(req,res) =>{
//     res.render(`home`)
// })
app.get('/cart',(req,res) =>{
    res.render(`./customer/cart`)
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/cart', (req, res) => {
    res.render('customers/cart')
})

app.get('/login', (req, res) => {
    res.render('auth/login')
})

app.get('/register', (req, res) => {
    res.render('auth/register')
})

app.listen(PORT,()=>{
    console.log(`Listening on port  ${PORT}`)
}
)