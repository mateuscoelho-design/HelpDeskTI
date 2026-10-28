//Autorização: verifica se o usuário é administrador
const verifyAdmin = (req, res, next) => {

    //verificar o tipo do usuário autenticado
    if(!req.user || req.user.tipo !== 'admin'){
        return res.status(403).json({
            message: 'Acesso negado. Apenas administradores podem realizar esta operação'
        })
    }

    //permitir continuar para o Controller
    return next()
}

module.exports = verifyAdmin