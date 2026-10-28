import { useState } from 'react'

function Login({ onLogin, onCadastro }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  //Realizar login na API
  async function entrar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const resposta = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.message || 'Erro ao realizar login')
        return
      }

      //Salvar os dados do usuário no App
      onLogin({
        name: dados.name,
        tipo: dados.tipo,
        token: dados.token
      })

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

        <h2>Entrar</h2>
        <p className="texto-secundario">
          Informe seus dados para acessar o sistema.
        </p>

        <form onSubmit={entrar}>
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
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {erro && <p className="mensagem-erro">{erro}</p>}

          <button
            type="submit"
            className="btn btn-primario btn-largura-total"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-rodape">
          Não possui uma conta?{' '}
          <button
            type="button"
            className="btn-link"
            onClick={onCadastro}
          >
            Cadastre-se
          </button>
        </p>

      </div>
    </div>
  )
}

export default Login