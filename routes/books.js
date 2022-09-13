
const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


// All Books Route
router.get('/', async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const books = await query.exec()
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Book Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book(),'new')
})

// Create Book Route
router.post('/', async (req, res) => {
  createBook(req,res) 
})


router.get('/edit/:id',async(req,res)=>{
  const book=await Book.findById(req.params.id)
  renderNewPage(res,book,'edit')
})

router.put('/:id',async(req,res)=>{
  const book=await Book.findById(req.params.id)
  const newAll=await AuthorBooks.findOne({pageCount:book.pageCount,author:book.author})

  book.title=req.body.title
  book.author=req.body.author
  book.publishDate=new Date(req.body.publishDate)
  book.pageCount=req.body.pageCount
  book.description=req.body.description
  saveCover(book,req.body.cover)
  try {
    await book.save()
    showBook(book,res)
  } catch (e) {
    renderNewPage(res,book,'edit',true)
  }

  
  newAll.title=req.body.title
  newAll.author=req.body.author
  newAll.publishDate=new Date(req.body.publishDate)
  newAll.pageCount=req.body.pageCount
  newAll.description=req.body.description
  saveCover(book,req.body.cover)
  try {
    await newAll.save()
    console.log('documento modificato');
  } catch (e) {
    console.log(e);
  }
})

router.get('/:id',async(req,res)=>{
  const book=await Book.findById(req.params.id)
  showBook(book,res)
})



router.delete('/:id',async(req,res)=>{
  await Book.findByIdAndDelete(req.params.id)
  res.redirect('/books')
})





async function createBook(req,res){
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book,req.body.cover)
  try {
    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)
  } catch (e){
    renderNewPage(res, book, 'new',true)
  }
}


function showBook(book,res){
  res.render('books/show',{book:book})
}


function saveCover(book,coverEncode){
  if(coverEncode == null) return
  try {
    const cover=JSON.parse(coverEncode)
    if(coverEncode!=null && imageMimeTypes.includes(cover.type)){
      book.coverImage=new Buffer.from(cover.data,'base64')
      book.coverImageType=cover.type
    }
  } catch (e) {
    console.log('siamo nel catch');
  }
  

}

async function renderNewPage(res, book, type,hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render(`books/${type}`, params)
  } catch {
    res.redirect('/books')
  }
}





module.exports = router