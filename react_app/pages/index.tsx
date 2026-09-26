import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import React from 'react';
import ThemeToggleButton from '../components/ThemeToggleButton';

function RandomMessage() {
  const mensagens = [
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
  ]

  const [mensagem, setMensagem] = useState(mensagens[0]);

  useEffect(() => {
    const aleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    setMensagem(aleatoria);
  }, []);

  return (
    <div className="random-message">
      <h3 className="random-message-title">{mensagem.titulo}</h3>
      <p className="random-message-text">{mensagem.texto}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Vamos começar!</title>
      </Head>
      <ThemeToggleButton />
      <main className="auth-page">
        <div className="auth-left">
          <h1> Vamos começar! 🎉</h1>
          <p>Cadastre-se ou entre para descobrir eventos que combinam com você.</p>
          <div className='auth-buttons'>
            <Link href="/register" legacyBehavior>
              <button className='primary-button'>
                Começar agora
              </button>
            </Link>

            <div>
              <Link href="/login" legacyBehavior>
                <span className="auth-secondary-link">
                  Já tenho conta
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="logo-orbit-container">
            <div className="logo-orbit-center">
              <img src="/imgs/logo.png" alt="Logo" className="auth-logo" />
            </div>

            {[1, 2, 3].map((r) => (
              <div key={`ring-${r}`} className={`orbit-ring ring-${r}`}></div>
            ))}

            {[130, 160, 190].map((radius, i) => (
              <div
                key={`dot-${i}`}
                className="orbiter"
                style={{
                  animation: `spin ${10 + i * 2}s linear infinite`,
                }}
              >
                <div
                  className="orbit-dot"
                  style={{
                    backgroundColor: ['#f90', '#3f3c56', '#6c47b7', '#ffb930'][i],
                    transform: `translateX(${radius}px)`,
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
