const Demanda = require('../models/Demandas')

//Controller responsável pelas operações das demandas
module.exports = class DemandaController {

    //Listar todas as demandas
    static async list(req, res) {
        try {
            const demandas = await Demanda.findAll()

            return res.status(200).json({demandas})

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao listar demandas'
            })
        }
    }

    //Consultar uma demanda pelo ID
    static async getById(req, res) {
        try {
            const demanda = await Demanda.findByPk(req.params.id)

            if (!demanda) {
                return res.status(404).json({
                    message: 'Demanda não encontrada'
                })
            }

            return res.status(200).json({demanda})

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao consultar demanda'
            })
        }
    }

    //Criar uma nova demanda
    static async create(req, res) {
        const {titulo, descricao, prioridade = 'media', status} = req.body

        //Validar os campos obrigatórios
        if (typeof titulo !== 'string' || !titulo.trim() ||
            typeof descricao !== 'string' || !descricao.trim()) {
            return res.status(422).json({
                message: 'Título e descrição são obrigatórios'
            })
        }

        //Validar a prioridade
        if (!['baixa', 'media', 'alta'].includes(prioridade)) {
            return res.status(422).json({
                message: 'Prioridade deve ser baixa, media ou alta'
            })
        }

        //O status não pode ser definido manualmente
        if (status !== undefined) {
            return res.status(422).json({
                message: 'O status é definido automaticamente'
            })
        }

        try {
            const demanda = await Demanda.create({
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                prioridade: prioridade,
                status: 'pendente'
            })

            return res.status(201).json({
                message: 'Demanda criada com sucesso',
                demanda
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao criar demanda'
            })
        }
    }

    //Editar uma demanda
    static async update(req, res) {
        const {titulo, descricao, prioridade, status} = req.body

        try {
            const demanda = await Demanda.findByPk(req.params.id)

            if (!demanda) {
                return res.status(404).json({
                    message: 'Demanda não encontrada'
                })
            }

            //Regra de negócio: demanda concluída não pode ser editada
            if (demanda.status === 'concluida') {
                return res.status(400).json({
                    message: 'Não é possível editar uma demanda concluída'
                })
            }

            //Impedir alteração direta do status
            if (status !== undefined) {
                return res.status(422).json({
                    message: 'Utilize a operação de concluir demanda'
                })
            }

            //Validar os campos informados
            if (titulo !== undefined) {
                if (typeof titulo !== 'string' || !titulo.trim()) {
                    return res.status(422).json({
                        message: 'Título inválido'
                    })
                }
            }

            if (descricao !== undefined) {
                if (typeof descricao !== 'string' || !descricao.trim()) {
                    return res.status(422).json({
                        message: 'Descrição inválida'
                    })
                }
            }

            if (prioridade !== undefined &&
                !['baixa', 'media', 'alta'].includes(prioridade)) {
                return res.status(422).json({
                    message: 'Prioridade inválida'
                })
            }

            //Atualizar somente os campos enviados
            await demanda.update({
                titulo: titulo !== undefined ? titulo.trim() : demanda.titulo,
                descricao: descricao !== undefined ? descricao.trim() : demanda.descricao,
                prioridade: prioridade !== undefined ? prioridade : demanda.prioridade
            })

            return res.status(200).json({
                message: 'Demanda atualizada com sucesso',
                demanda
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao atualizar demanda'
            })
        }
    }

    //Excluir uma demanda
    static async delete(req, res) {
        try {
            const demanda = await Demanda.findByPk(req.params.id)

            if (!demanda) {
                return res.status(404).json({
                    message: 'Demanda não encontrada'
                })
            }

            await demanda.destroy()

            return res.status(200).json({
                message: 'Demanda excluída com sucesso'
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao excluir demanda'
            })
        }
    }

    //Marcar uma demanda como concluída
    static async conclude(req, res) {
        try {
            const demanda = await Demanda.findByPk(req.params.id)

            if (!demanda) {
                return res.status(404).json({
                    message: 'Demanda não encontrada'
                })
            }

            //Regra de negócio: não concluir duas vezes
            if (demanda.status === 'concluida') {
                return res.status(400).json({
                    message: 'Esta demanda já está concluída'
                })
            }

            //Alterar o status da demanda
            await demanda.update({status: 'concluida'})

            return res.status(200).json({
                message: 'Demanda concluída com sucesso',
                demanda
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao concluir demanda'
            })
        }
    }
}