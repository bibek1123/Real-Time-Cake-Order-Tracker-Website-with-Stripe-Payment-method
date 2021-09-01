// Create Express server:-

const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-Layouts');

const PORT = process.env.PORT || 3000

app.get('/', (req,res)=>{
    res.render('home')
})


// Set template Engine:-
app.use(expressLayout)

app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')



app.listen(PORT , (req,res)=>{
    console.log(`My server running at ${PORT}`)
})