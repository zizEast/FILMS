const express=require('express');
const router=express.Router();
const Author=require('../models/Author')

router.get('/new',(req,res)=>{
    res.render('new')
})

router.get('/',async(req,res)=>{
    const authors=await Author.find({})
    res.render('index',{authors:authors})
})

router.post('/',async(req,res)=>{
    const author=new Author({
        name:req.body.name
    })
    author.save((err,newAuthor)=>{
        if(err){
            res.render('new',{author:author,errorMessage:'Error creating author'})
        }else{
            //res.redirect(`/authors/${author.id}`)
            res.redirect('/authors')
        }
    })
})

router.delete('/:id',async(req,res)=>{
    await Author.findByIdAndDelete(req.params.id)
    res.redirect('/authors')
})

router.post('/tutti',async(req,res)=>{
    const authors=await Author.find({})
    authors.forEach(async(author)=>{
        await Author.findByIdAndDelete(author.id)
    })

    res.redirect('/authors')
   
})

module.exports=router