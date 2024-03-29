const express = require("express")
const app = express()

app.use(express.json())

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

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`listing on port: ${PORT}`)
})

