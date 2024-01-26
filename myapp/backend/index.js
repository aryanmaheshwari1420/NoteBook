const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express()
const port = 5000
app.use(cors(
  {
    origin:["https://note-book-onhand.vercel.app/"],
    methods:['POST','GET','PUT','DELETE'],
    credentials:true
  }
))
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Notebook is listening at http://localhost:${port}`)
})

// mongodb+srv://aryanmaheshwari1420:rr1234@cluster0.ef0pna7.mongodb.net/notebook