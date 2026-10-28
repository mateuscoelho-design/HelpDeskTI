//requerer a model do User
const User = require('../models/Users')
//requer a bibliote bcrypt
const bcrypt = require('bcrypt')
//requerer o nosso serviço para gerar token
const createUserToken = require('../helpers/create-user-token')

module.exports = class UserController{
    static async register(req, res){
        const {name, email, password, image, phone} = req.body

        try {
            //verificar se o usuário já exite
            const userExists = await User.findOne({where:{email:email}})
            if(userExists){
                res.status(422).json({
                    message:"Usuário já cadastrado, utilize outro e-mail"
                })
                return
            }

            //criptografar a senha
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            //Criar o novo usario
            await User.create({
                name: name,
                email: email,
                password: passwordHash,
                phone: phone,
                tipo: 'funcionario'
            })
            res.status(201).json({message:'Usuario cadastrado com sucesso'})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Erro interno ao cadastrar usuário'})
        }
    }

    //metado para listar todos os usuarios
    static async listAll(req, res){
        try {
            const users = await User.findAll({
                attributes: {exclude: ['password']}
            })
            res.status(200).json({users})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Erro interno ao listar usuários'})
        }
    }

    //Criar o método de login
    static async login(req, res){
        //requerer pelo body os parametros do login
        const {email, password} = req.body

        try {
            //verificar se o usuario existe
            const user = await User.findOne({where:{email:email}})

            if(!user){
                res.status(401).json({
                    message:"E-mail ou senha inválidos"
                })
                return
            }

            //verificar o password
            const checkPassword = await bcrypt.compare(password, user.password)

            //retornar a mensagem para senha incorreta
            if(!checkPassword){
                res.status(401).json({
                    message:"E-mail ou senha inválidos"
                })
                return
            }

            //geramos o token para o usuario
            await createUserToken(user, req, res)
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Erro interno ao realizar login'})
        }
    }
}
