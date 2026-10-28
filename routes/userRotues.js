//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const userController = require('../controllers/userController')
//requerer as validações
const {registerValidationRules, loginValidationRules, validate} = require('../helpers/userValidator')

//requerer os middlewares de autenticação e autorização
const verifyToken = require('../helpers/verify-token')
const verifyAdmin = require('../helpers/verify-admin')

//Rotas
//Register
route.post('/register',registerValidationRules(),validate,userController.register)

//Listar todos - somente administrador autenticado
route.get('/', verifyToken, verifyAdmin, userController.listAll)

//rota de login
route.post('/login', loginValidationRules(), validate, userController.login)

module.exports = route