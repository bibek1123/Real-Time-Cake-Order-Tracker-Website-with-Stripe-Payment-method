// Create Express server:-

const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-Layouts');

const PORT = process.env.PORT || 3000

// Assets:-
app.use(express.static('public'))


// Set template Engine:-
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs');



// routes:-[Note: Always make sure these routes are come after template Engine.]
app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/login', (req,res)=>{
    res.render('auth/login')
})

app.get('/register', (req,res)=>{
    res.render('auth/register')
})

app.get('/cart', (req,res)=>{
    res.render('customers/cart')
});




app.listen(PORT , (req,res)=>{
    console.log(`My server running at ${PORT}`)
})