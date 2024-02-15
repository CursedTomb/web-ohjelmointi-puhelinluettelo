const express = require("express")
var morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan("tiny"))


let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
]

app.get("/", (req, resp) => {
    resp.send(`usage:
    GET /api/persons`)
})

app.get("/api/persons", (request, response) =>{
    response.json(persons)
})

app.get("/info", (request, response) => {
    response.writeHead(200, {'content-type': 'text/html; charset=utf-8;'})
    response.write(`<p>Phonebook has info ${persons.length} people</p>`)
    response.end(`<p>${Date()}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).send()
})

const generateId = () =>{
    return Math.round(Math.random()*1000)
}
app.post("/api/persons", (request, response) =>{
    const newPerson = request.body
    if(!(newPerson.name && newPerson.number)){
        return response.status(400)
        .json({error: "name or number missing"})
    }
    
    if(persons.filter(person => person.name===newPerson.name).length>0){
        return response.status(400)
        .json({error: "name must be unique"})
    }

    const person = {
        name: newPerson.name,
        number: newPerson.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`listing on port: ${PORT}`)
})

