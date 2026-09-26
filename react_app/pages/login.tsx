import Head from 'next/head'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import ThemeToggleButton from '../components/ThemeToggleButton'

function RandomMessage() {
  const session = useSession()

  const mensagens = useMemo(
    () => [
      {
        titulo: 'Experiência personalizada',
        texto: 'Eventos filtrados por você, no lugar certo, na hora certa.'
      },
      {
        titulo: 'Descoberta de eventos',
        texto: 'Encontre os melhores eventos culturais, esportivos e comunitários em um só lugar.'
      }
    ],
    []
  )

  const [mensagem, setMensagem] = useState(mensagens[0])

  useEffect(() => {
    const aleatoria = mensagens[Math.floor(Math.random() * mensagens.length)]
    setMensagem(aleatoria)
  }, [mensagens])

  return (
    <div className="random-message">
      <h3 className="random-message-title">{mensagem.titulo}</h3>
      <p className="random-message-text">{mensagem.texto}</p>
    </div>
  )
}

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/feed')
    }
  }, [status, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError('Preencha os campos')
      return
    }

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password
    })

    if (result?.error) {
      console.error('Erro no login:', result.error)
      setError('Usuário ou senha inválidos')
    } else {
      router.push('/feed')
    }
  }

  return (
    <>
      <Head>
        <title>Login - Chegados</title>
      </Head>
      <main className="auth-page">
        <div className="auth-left">
          <h1>Bem-vindo(a) de volta! 👋</h1>
          <p>Faça login para continuar explorando os eventos.</p>

          <form className="auth-buttons" onSubmit={handleLogin}>
            <input
              className="auth-input"
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}
            <button className="primary-button" type="submit" style={{ marginTop: '1.5rem' }}>
              Entrar
            </button>
          </form>
        </div>

        <div className="auth-right">
          <div className="logo-orbit-container">
            <div className="logo-orbit-center">
              <img src="/imgs/logo.png" alt="Logo" className="auth-logo" />
            </div>
            {[1, 2, 3].map(r => (
              <div key={`ring-${r}`} className={`orbit-ring ring-${r}`} />
            ))}
            {[130, 160, 190].map((radius, i) => (
              <div
                key={`dot-${i}`}
                className="orbiter"
                style={{
                  animation: `spin ${10 + i * 2}s linear infinite`
                }}
              >
                <div
                  className="orbit-dot"
                  style={{
                    backgroundColor: ['#f90', '#3f3c56', '#6c47b7'][i % 3],
                    transform: `translateX(${radius}px)`
                  }}
                />
              </div>
            ))}
          </div>
          <RandomMessage />
        </div>
      </main>
      <ThemeToggleButton />
    </>
  )
}
