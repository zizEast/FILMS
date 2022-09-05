if(process.env.NODE_ENV!='production'){
    require('dotenv').config()
}

const express=require('express');
const app=express();

const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');

const indexRouter=require('./router/indexRouter')
const authorsRouter=require('./router/authorsRouter')

const methodOverride=require('method-override');
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true});

const db=mongoose.connection;

db.on('error',err=>{throw err})
db.once('open',()=>{console.log('siamo connessi ad Atlas!');})

app.set('view engine','ejs');
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(expressLayouts);

app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

app.use(indexRouter)
app.use('/authors',authorsRouter);


app.listen(process.env.PORT||3000)
