//requere o express
const express = require('express')
//instancia do express
const api = express()
//requerer o cors
const cors = require('cors')
//requerer a conexao
const conn = require('./db/conn')
//requerer os Models
const User = require('./models/Users')
const Demanda = require('./models/Demandas')

//requerer a rotas dos usuarios (user)
const userRoutes = require('./routes/userRotues')

//requerer as rotas de demandas
const demandaRoutes = require('./routes/demandaRoutes')

//Configurando JSON response
api.use(express.json())

//salve cors
api.use(cors({ credentials: true, origin: 'http://localhost:3030' }))

//rotas de usuarios
api.use('/users',userRoutes)

//rotas de demandas
api.use('/demandas',demandaRoutes)

//start api
conn.sync()
    .then(() => { api.listen(3030) })
    .catch(error => { console.info(error) })