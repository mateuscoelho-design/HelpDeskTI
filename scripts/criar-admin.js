require('dotenv').config()

//requerer o bcrypt
const bcrypt = require('bcrypt')

//requerer a conexão e o Model de usuários
const conn = require('../db/conn')
const User = require('../models/Users')

//Criar o primeiro administrador do sistema
async function criarAdmin() {

    //pegar as informações do arquivo .env
    const name = process.env.ADMIN_NAME?.trim()
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD
    const phone = process.env.ADMIN_PHONE?.trim()

    //verificar os campos obrigatórios
    if (!name || !email || !password || !phone) {
        console.log('Preencha as configurações ADMIN no arquivo .env')
        return
    }

    //validar informações básicas
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
        console.log('Informe um e-mail válido e uma senha de pelo menos 8 caracteres')
        return
    }

    try {
        //garantir que a tabela de usuários exista
        await User.sync()

        //verificar se já existe um administrador
        const adminExiste = await User.findOne({
            where: {tipo: 'admin'}
        })

        if (adminExiste) {
            console.log('Já existe um administrador cadastrado')
            return
        }

        //verificar se o e-mail já está cadastrado
        const userExiste = await User.findOne({
            where: {email: email}
        })

        if (userExiste) {
            console.log('Este e-mail já está cadastrado')
            return
        }

        //criptografar a senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //cadastrar o administrador
        await User.create({
            name: name,
            email: email,
            password: passwordHash,
            phone: phone,
            tipo: 'admin'
        })

        console.log('Administrador cadastrado com sucesso!')

    } catch (error) {
        console.error('Erro ao criar administrador:', error.message)

    } finally {
        //encerrar a conexão com o banco
        await conn.close()
    }
}

criarAdmin()