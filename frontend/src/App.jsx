import { useState } from 'react'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Demandas from './pages/Demandas'
import './styles.css'

function App() {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem('usuarioHelpDesk')

    if (usuarioSalvo) {
      try {
        return JSON.parse(usuarioSalvo)
      } catch {
        localStorage.removeItem('usuarioHelpDesk')
      }
    }

    return null
  })

  const [tela, setTela] = useState('login')

  //Salvar o usuário após realizar login
  function fazerLogin(dadosUsuario) {
    localStorage.setItem('usuarioHelpDesk', JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)
  }

  //Sair do sistema
  function sair() {
    localStorage.removeItem('usuarioHelpDesk')
    setUsuario(null)
    setTela('login')
  }

  //Mostrar painel quando estiver logado
  if (usuario) {
    return <Demandas usuario={usuario} onSair={sair} />
  }

  //Mostrar cadastro
  if (tela === 'cadastro') {
    return <Cadastro onVoltar={() => setTela('login')} />
  }

  //Mostrar login
  return (
    <Login
      onLogin={fazerLogin}
      onCadastro={() => setTela('cadastro')}
    />
  )
}

export default App