import { useCallback, useEffect, useState } from 'react'

function Demandas({ usuario, onSair }) {
  const [demandas, setDemandas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const [formAberto, setFormAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media'
  })

  //Verificar se o usuário é administrador
  const isAdmin = usuario.tipo === 'admin'

  //Buscar as demandas na API
  const carregarDemandas = useCallback(async () => {
    setCarregando(true)

    try {
      const resposta = await fetch('/demandas', {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao carregar demandas')
      }

      setDemandas(dados.demandas || [])

    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }, [usuario.token])

  //Carregar as demandas quando entrar no painel
  useEffect(() => {
    carregarDemandas()
  }, [carregarDemandas])

  //Abrir formulário para criar uma demanda
  function abrirCadastro() {
    setEditandoId(null)
    setForm({
      titulo: '',
      descricao: '',
      prioridade: 'media'
    })
    setErro('')
    setMensagem('')
    setFormAberto(true)
  }

  //Abrir formulário para editar uma demanda
  function abrirEdicao(demanda) {
    setEditandoId(demanda.id)
    setForm({
      titulo: demanda.titulo,
      descricao: demanda.descricao,
      prioridade: demanda.prioridade
    })
    setErro('')
    setMensagem('')
    setFormAberto(true)
  }

  //Criar ou editar uma demanda
  async function salvarDemanda(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setSalvando(true)

    const editando = editandoId !== null

    const url = editando
      ? `/demandas/${editandoId}`
      : '/demandas'

    try {
      const resposta = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuario.token}`
        },
        body: JSON.stringify(form)
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao salvar demanda')
      }

      setMensagem(dados.message)
      setFormAberto(false)
      setEditandoId(null)

      await carregarDemandas()

    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  //Concluir uma demanda
  async function concluirDemanda(id) {
    setErro('')
    setMensagem('')

    try {
      const resposta = await fetch(`/demandas/${id}/concluir`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao concluir demanda')
      }

      setMensagem(dados.message)
      await carregarDemandas()

    } catch (error) {
      setErro(error.message)
    }
  }

  //Excluir uma demanda
  async function excluirDemanda(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir esta demanda?'
    )

    if (!confirmar) return

    setErro('')
    setMensagem('')

    try {
      const resposta = await fetch(`/demandas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao excluir demanda')
      }

      setMensagem(dados.message)
      await carregarDemandas()

    } catch (error) {
      setErro(error.message)
    }
  }

  //Contadores do painel
  const total = demandas.length
  const pendentes = demandas.filter(
    (demanda) => demanda.status === 'pendente'
  ).length

  const concluidas = demandas.filter(
    (demanda) => demanda.status === 'concluida'
  ).length

  return (
    <div className="pagina-painel">

      {/* Cabeçalho */}
      <header className="painel-cabecalho">
        <div>
          <h1>HelpDeskTI</h1>
          <p>Gerenciamento de demandas de TI</p>
        </div>

        <div className="painel-usuario">
          <div className="usuario-info">
            <strong>{usuario.name}</strong>
            <span>
              {isAdmin
                ? 'Coordenador de Service Desk'
                : 'Analista de Suporte de TI'}
            </span>
          </div>

          <button className="btn btn-sair" onClick={onSair}>
            Sair
          </button>
        </div>
      </header>

      <main className="painel-conteudo">

        <div className="painel-titulo">
          <div>
            <h2>Painel de demandas</h2>
            <p className="texto-secundario">
              Acompanhe as solicitações de suporte técnico.
            </p>
          </div>

          {isAdmin && (
            <button
              className="btn btn-primario"
              onClick={abrirCadastro}
            >
              + Nova demanda
            </button>
          )}
        </div>

        {/* Resumo */}
        <div className="cards-resumo">
          <div className="card-resumo">
            <span>Total de demandas</span>
            <strong>{total}</strong>
          </div>

          <div className="card-resumo">
            <span>Pendentes</span>
            <strong>{pendentes}</strong>
          </div>

          <div className="card-resumo">
            <span>Concluídas</span>
            <strong>{concluidas}</strong>
          </div>
        </div>

        {/* Mensagens */}
        {erro && <p className="mensagem-erro">{erro}</p>}
        {mensagem && (
          <p className="mensagem-sucesso">{mensagem}</p>
        )}

        {/* Formulário de demandas - somente admin */}
        {isAdmin && formAberto && (
          <section className="card-painel">
            <h3>
              {editandoId !== null
                ? 'Editar demanda'
                : 'Nova demanda'}
            </h3>

            <form onSubmit={salvarDemanda}>

              <div className="campo">
                <label htmlFor="titulo">Título</label>
                <input
                  id="titulo"
                  type="text"
                  value={form.titulo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titulo: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  rows="3"
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descricao: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="prioridade">Prioridade</label>
                <select
                  id="prioridade"
                  value={form.prioridade}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      prioridade: e.target.value
                    })
                  }
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="form-acoes">
                <button
                  type="submit"
                  className="btn btn-primario"
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar demanda'}
                </button>

                <button
                  type="button"
                  className="btn btn-secundario"
                  onClick={() => setFormAberto(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Tabela de demandas */}
        <section className="card-painel">
          <div className="tabela-cabecalho">
            <h3>Demandas cadastradas</h3>

            <button
              className="btn btn-secundario"
              onClick={carregarDemandas}
            >
              Atualizar
            </button>
          </div>

          {carregando ? (
            <p className="texto-secundario">
              Carregando demandas...
            </p>
          ) : demandas.length === 0 ? (
            <p className="texto-secundario">
              Nenhuma demanda cadastrada.
            </p>
          ) : (
            <div className="tabela-container">
              <table className="tabela-demandas">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Demanda</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {demandas.map((demanda) => (
                    <tr key={demanda.id}>
                      <td>#{demanda.id}</td>

                      <td>
                        <strong>{demanda.titulo}</strong>
                        <p>{demanda.descricao}</p>
                      </td>

                      <td>
                        <span
                          className={`tag-prioridade prioridade-${demanda.prioridade}`}
                        >
                          {demanda.prioridade === 'media'
                            ? 'Média'
                            : demanda.prioridade === 'alta'
                              ? 'Alta'
                              : 'Baixa'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`tag-status status-${demanda.status}`}
                        >
                          {demanda.status === 'concluida'
                            ? 'Concluída'
                            : 'Pendente'}
                        </span>
                      </td>

                      <td>
                        <div className="acoes-tabela">

                          {demanda.status === 'pendente' && (
                            <button
                              className="btn btn-concluir"
                              onClick={() =>
                                concluirDemanda(demanda.id)
                              }
                            >
                              Concluir
                            </button>
                          )}

                          {isAdmin && demanda.status === 'pendente' && (
                            <button
                              className="btn btn-secundario"
                              onClick={() => abrirEdicao(demanda)}
                            >
                              Editar
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              className="btn btn-excluir"
                              onClick={() =>
                                excluirDemanda(demanda.id)
                              }
                            >
                              Excluir
                            </button>
                          )}

                          {!isAdmin &&
                            demanda.status === 'concluida' && (
                              <span className="texto-secundario">
                                Sem ações
                              </span>
                            )}

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}

export default Demandas