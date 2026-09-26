import Head from 'next/head'
import { useRouter } from 'next/router'
import ThemeToggleButton from '../components/ThemeToggleButton'

import { useEffect, useMemo, useState } from 'react'

function RandomMessage() {
  const mensagens = useMemo(
    () => [
      {
        titulo: 'Experiência personalizada',
        texto: 'Eventos filtrados por você, no lugar certo, na hora certa.'
      },
      {
        titulo: 'Descoberta de eventos',
        texto: 'Encontre os melhores eventos culturais, esportivos e comunitários em um só lugar.'
      },
      {
        titulo: 'Recomendações inteligentes',
        texto: 'Receba sugestões com base nos seus gostos, localização e histórico de navegação.'
      },
      {
        titulo: 'Engajamento com a comunidade',
        texto: 'Avalie, comente e descubra o que outras pessoas estão curtindo na sua cidade.'
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

export default function RegisterPage() {
  const router = useRouter()

  const handleCreateAccount = () => {
    router.push('/register_email')
  }

  return (
    <>
      <Head>
        <title>Cadastro - Toggo</title>
      </Head>

      <main className="auth-page">

        <div className="auth-left">
          <h1>Vamos começar! 🎉</h1>
          <p>Cadastre-se ou entre para descobrir eventos que combinam com você.</p>
          <div className="auth-buttons">
            <button className="primary-button" onClick={handleCreateAccount}>
              Criar nova conta
            </button>

            <div className="separator">
              <hr />
              <span>OU</span>
              <hr />
            </div>

            <button className="social-button">
              <img src="/imgs/facebook.png" alt="Facebook" width={20} />
              Continue com Facebook
            </button>

            <button className="social-button">
              <img src="/imgs/google.png" alt="Google" width={20} />
              Continue com Gmail
            </button>
          </div>
        </div>

        <div className="auth-right">
          {' '}
          <div className="logo-orbit-container">
            <div className="logo-orbit-center">
              <img src="/imgs/logo.png" alt="Logo" className="auth-logo" />
            </div>

            {[1, 2, 3].map(r => (
              <div key={`ring-${r}`} className={`orbit-ring ring-${r}`}></div>
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
                    backgroundColor: ['#f90', '#3f3c56', '#6c47b7', '#ffb930'][i],
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
