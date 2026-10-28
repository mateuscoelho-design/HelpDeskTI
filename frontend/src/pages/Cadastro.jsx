import { useState } from 'react'

function Cadastro({ onVoltar }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  //Cadastrar funcionário na API
  async function cadastrar(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      const resposta = await fetch('/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.message || 'Erro ao cadastrar usuário')
        return
      }

      setSucesso('Cadastro realizado com sucesso! Agora você pode fazer login.')

      //Limpar os campos
      setName('')
      setEmail('')
      setPhone('')
      setPassword('')

    } catch (error) {
      setErro('Não foi possível conectar ao servidor')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="pagina-auth">
      <div className="card-auth">

        <div className="auth-cabecalho">
          <h1>HelpDeskTI</h1>
          <p>Gerenciamento de demandas de TI</p>
        </div>

        <h2>Criar conta</h2>
        <p className="texto-secundario">
          Preencha os dados para se cadastrar como funcionário.
        </p>

        <form onSubmit={cadastrar}>

          <div className="campo">
            <label htmlFor="name">Nome completo</label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              type="tel"
              placeholder="Digite seu telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {erro && <p className="mensagem-erro">{erro}</p>}

          {sucesso && (
            <p className="mensagem-sucesso">{sucesso}</p>
          )}

          <button
            type="submit"
            className="btn btn-primario btn-largura-total"
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>

        </form>

        <p className="auth-rodape">
          Já possui uma conta?{' '}
          <button
            type="button"
            className="btn-link"
            onClick={onVoltar}
          >
            Voltar para login
          </button>
        </p>

      </div>
    </div>
  )
}

export default Cadastro