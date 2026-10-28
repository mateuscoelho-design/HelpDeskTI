//requerer somente o metodo DataTypes do Sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão com banco
const conn = require('../db/conn')

//definier o model user
const User = conn.define('users',{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    image:{
        type: DataTypes.STRING,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false
    },
    //tipo de usuário usado na autorização
    tipo:{
        type: DataTypes.ENUM('admin', 'funcionario'),
        allowNull: false,
        defaultValue: 'funcionario'
    }
})

module.exports = User
