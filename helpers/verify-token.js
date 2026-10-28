require('dotenv').config()

//requerer a biblioteca jwt
const jwt = require('jsonwebtoken')

//Autenticação: verifica se o usuário enviou um JWT válido
const verifyToken = (req, res, next) => {

    //pegar o token enviado no cabeçalho
    const authorization = req.headers.authorization || ''
    const match = authorization.match(/^Bearer\s+(.+)$/i)

    //verificar se o token foi informado
    if(!match){
        return res.status(401).json({
            message: 'Token não informado'
        })
    }

    try {
        //verificar se o token é válido
        const verified = jwt.verify(
            match[1],
            process.env.CHAVETOKEN
        )

        //guardar os dados do usuário autenticado
        req.user = verified

        //permitir continuar para a próxima etapa
        return next()

    } catch(error){
        return res.status(401).json({
            message: 'Token inválido ou expirado'
        })
    }
}

module.exports = verifyToken