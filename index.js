const { response } = require('express')
const express = require('express')
const app = express()
var morgan = require('morgan')
morgan.token('body', function (req, res) {return JSON.stringify(req.body) })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return res.status(400).json({
            error: `${body.name} already exists in the phonebook`
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    res.json(person)

})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => persons.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    const amount = persons.length
    const date = new Date()
    res.send(`<div>
    <p>Phonebook has info for ${amount} people</p>
    <p>${date}<p>
    </div>`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)