//requerer somente o metodo DataTypes do Sequelize
const {DataTypes} = require('sequelize')

//requerer a conexão com banco
const conn = require('../db/conn')

//definir o model de demandas
const Demanda = conn.define('demandas', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    prioridade: {
        type: DataTypes.ENUM('baixa', 'media', 'alta'),
        allowNull: false,
        defaultValue: 'media'
    },
    status: {
        type: DataTypes.ENUM('pendente', 'concluida'),
        allowNull: false,
        defaultValue: 'pendente'
    }
})

module.exports = Demanda