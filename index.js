const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
morgan.token('data', function(req, res) {
  return JSON.stringify({name: req.body.name, number: req.body.number})
})

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :data`))



let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

  app.get('/', (req, res)=> {
    res.send(`<h1>Hello World</h1>`)
  })

  app.get('/api/phonebook', (req, res)=> {
    res.json(phonebook)
  })

  app.get('/api/phonebook/:id', (req, res)=> {
    const id = Number(req.params.id)
    console.log(id)
    const person = phonebook.find(person => {
      console.log(person.id, typeof person.id, id, typeof id, person.id === id)
      return person.id === id
    })
    console.log(person)
    if(person){
      res.json(person)
    }else{
      res.status(404).end()
    }
    
  })

  app.get('/info', (req, res)=>{
    const today = new Date()
    res.send(`<p>Phonebook has info for ${phonebook.length} people.</p>
    <p> ${today}`)
  })

  app.delete('/api/phonebook/:id', (req, res)=> {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(person => person.id !== id)

    res.status(204).end()
  })

  const generateId = () => {
    
    return Math.round(Math.random() * 1000)
  }

  app.post('/api/phonebook', (req, res)=>{
    const body = req.body
    
    if(!body.name){
      return res.status(400).json({
        error: 'name missing'
      })
    }else if(phonebook.find(person => body.name === person.name)){
      return res.status(400).json({
        error: `${body.name} already in contacts`
      })
    }else if(!body.number){
      return res.status(400).json({
        error: 'number missing'
      })
    }

    const person = {
      id: generateId(),
      name: body.name,
      vip: body.vip || false,
    }
    phonebook = phonebook.concat(person)

    res.json(person)
  })

  const unknownEndpoint = (req, res)=>{
    res.status(404).send({
      error: 'unknown endpoint'})
  }
  app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, ()=> {
  console.log(`Server listening on port ${PORT}`)
})
