//requerer a biblioteca router do express
const route = require('express').Router()

//requerer o controller de demandas
const DemandaController = require('../controllers/demandaController')

//requerer os middlewares de autenticação e autorização
const verifyToken = require('../helpers/verify-token')
const verifyAdmin = require('../helpers/verify-admin')

//Rotas

//Listar todas as demandas - usuários autenticados
route.get('/', verifyToken, DemandaController.list)

//Consultar uma demanda pelo ID - usuários autenticados
route.get('/:id', verifyToken, DemandaController.getById)

//Criar demanda - somente administrador
route.post('/', verifyToken, verifyAdmin, DemandaController.create)

//Editar demanda - somente administrador
route.put('/:id', verifyToken, verifyAdmin, DemandaController.update)

//Excluir demanda - somente administrador
route.delete('/:id', verifyToken, verifyAdmin, DemandaController.delete)

//Concluir demanda - administrador e funcionário
route.patch('/:id/concluir', verifyToken, DemandaController.conclude)

module.exports = route