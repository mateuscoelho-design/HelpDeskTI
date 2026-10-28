require('dotenv').config()

//requerer o siquelize
const Sequelize = require('sequelize')

//parametros de conexão
const conn = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: Number(process.env.DB_PORT) || 3306
    }
)

conn.authenticate()
    .then(() => {
        console.info('Banco de Dados conectado com sucesso!')
    })
    .catch((error) => {
        console.info(`Não foi possivel conectar ao banco: ${error}`)
    })

module.exports = conn