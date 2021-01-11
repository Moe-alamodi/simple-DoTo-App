let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML= require('sanitize-html')

let app = express()
let db

app.use(express.static('public'))

let connectionString = 'mongodb+srv://moealamodi:yA705316@cluster0.eooqa.mongodb.net/ToDoApp?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db()
  app.listen(3000)
})
  
app.use(express.json())
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next){
  res.set('www-Authenticate','Basic realm= "Simple Todo App"')
  console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic Y2hlbHNlYWZjOmNoZWxzZWE=") {
    next()
  } else {
    res.status(401).send("Authentication is required")

  }
  
}

app.use(passwordProtected)

app.get('/', function(req, res) {
  db.collection('items').find().toArray(function(err, items) {
    res.send(`<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
  <div class="container">
  <h1 class="display-4 text-center py-1">To-Do App!</h1>
  
  <div class="jumbotron p-3 shadow-sm">
  <form action="/create-item" method="POST">
  <div class="d-flex align-items-center">
  <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" required>
  <button class="btn btn-primary">Add New Item</button>
  </div>
  </form>
  </div>
  
  <ul class="list-group pb-5">
    ${items.map(function(item) {
      return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text">${item.text}</span>
      <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id ="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      </div>
      </li>`
    }).join('')}
  </ul>
  
  </div>
  
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  </body>
  </html>`)
  }) 
})

app.post('/create-item', function(req, res) {
  let saveText = sanitizeHTML (req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('items').insertOne({text: saveText}, function() {
    res.redirect('/')
  })
})

app.post('/update-item', function(req, res) {
  let saveText = sanitizeHTML (req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)}, {$set:{text: saveText}}, function(){
    res.send("Success")
  })
})

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
    res.send("Success")
  })
})