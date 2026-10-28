// requerer as bibliotecas do validator
const { body, validationResult } = require('express-validator')

//Regras de Validações
const registerValidationRules = () => {
    return [
        body('name').trim().notEmpty().withMessage('O nome é Obrigatório'),
        body('email').trim().notEmpty().withMessage('O E-email é obrigatório e deve ser válido').bail().isEmail().withMessage('O e-mail deve ser válido').normalizeEmail(),
        body('password').notEmpty().withMessage('A senha é Obrigatória'),
        body('phone').trim().notEmpty().withMessage('O telefone é Obrigatório'),
        //cadastro público nunca pode atribuir o perfil admin
        body('tipo').optional().equals('funcionario').withMessage('Cadastro público permite somente funcionario')
    ]
}

//Regras de Validação do Login
const loginValidationRules = () => {
    return [
        body('email').trim().isEmail().withMessage('Informe um e-mail válido').normalizeEmail(),
        body('password').notEmpty().withMessage('Informe a senha')
    ]
}

//Validação
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    //Retornar o primeiro erro encontrado
    return res.status(422).json({message: errors.array()[0].msg})
}

module.exports = {
    registerValidationRules,
    loginValidationRules,
    validate
}
