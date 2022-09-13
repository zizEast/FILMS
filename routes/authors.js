const express = require('express')
const path = require('path')
const router = express.Router()
const Author = require('../models/author')
const Book=require('../models/book')

// All Authors Route
router.get('/', async (req, res) => {
  let searchOptions={}
  if(req.query.name!='' && req.query.name!=null){
    searchOptions.name=new RegExp(req.query.name,'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
})

// Create Author  Route
router.post('/', async (req, res) => {
  createAuthor(Author,req,res)

  const schema = new AuthorBooks({
    name: req.body.name
  })
  try {
    await schema.save()
    // res.redirect(`authors/${newAuthor.id}`)
  } catch(e) {
    console.log(e);
  }
})


// Go to Edit Author
router.get('/edit/:id',async(req,res)=>{
  const author=await Author.findById(req.params.id)
  goToEdit(author,res)
})


//Show Article
router.get('/:id',async(req,res)=>{
  const author=await Author.findById(req.params.id)
  const books=await Book.find({author:author.id})
  res.render('authors/show',{author:author,booksByAuthor:books})
})

//Modifica Autore
router.put('/:id',async(req,res)=>{
  const autore=await Author.findById(req.params.id)
  const newAll=await AuthorBooks.findOne({name:autore.name})

  autore.name=req.body.name
  try {
    await autore.save()
    res.redirect(`/authors/${autore.id}`)
  } catch (e) {
    goToEdit(autore,res)
  }


  newAll.name=req.body.name
  try {
    await newAll.save()
  } catch (e) {
    console.log(e);
  }
})

//Elimina Articolo in home 
router.delete('/:id',async(req,res)=>{
  deleteAndRedirect(res,'/authors',req)
})




async function createAuthor(Schema,req,res){
  const schema = new Schema({
    name: req.body.name
  })
  try {
    const newAuthor = await schema.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'
    })
  }
}


async function deleteAndRedirect(res,path,req){
  const author=await Author.findById(req.params.id)
  try{
    await author.remove()
    res.redirect(path)
  }catch(e){
    toAuthorsWithError(res,e)
  }
}

async function toAuthorsWithError(res,err){
  const searchOptions={}
  const authors=await Author.find()
  res.render('authors/index',{authors:authors,errorMessage:`${err.message}`,searchOptions:searchOptions})
}


function goToEdit(author,res){
  res.render('authors/edit',{author:author})
}



module.exports = router