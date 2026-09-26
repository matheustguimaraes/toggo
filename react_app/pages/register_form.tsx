import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import 'react-phone-number-input/style.css'
import ThemeToggleButton from '../components/ThemeToggleButton'
import axios from 'axios'
import type { ComponentType } from 'react'
import { useSession, signIn } from 'next-auth/react'

const PhoneInput = dynamic(
  () => import('react-phone-number-input').then(mod => mod.default as unknown as ComponentType<any>),
  {
    ssr: false
  }
)

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
  const { data: session, status } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState<string | undefined>()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
  }, [session, status])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/feed')
    }
  }, [status, router])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/`,
        {
          username,
          email,
          password
        }
      )


      if (response.status === 201) {
        localStorage.setItem('registerPhone', phone || '')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const signInResult = await signIn('credentials', {
          username,
          password,
          redirect: false,
        })


        if (signInResult?.error) {
          setError(`Erro ao fazer login após o cadastro: ${signInResult.error}. Tente fazer login manualmente.`)
          console.error('SignIn error:', signInResult.error)
          
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          router.push('/register_code_phone')
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao cadastrar usuário.'
      setError(msg)
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Cadastro - Toggo</title>
      </Head>
      <main className="auth-page">
        <div className="auth-left">
          <h1>Bem-vindo ao Chegados! ✌️</h1>
          <p>Crie sua conta e comece a descobrir eventos do seu jeito.</p>

          <form onSubmit={handleSubmit} className="auth-buttons">
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                {error}
              </div>
            )}
            <input
              className="auth-input"
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <PhoneInput
              defaultCountry="BR"
              placeholder="Número do celular"
              value={phone}
              onChange={setPhone}
              international
              countryCallingCodeEditable={false}
              className="auth-input"
              disabled={isLoading}
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="password-input"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                <img
                  src={showPassword ? '/imgs/eye-off.png' : '/imgs/eye.png'}
                  alt="Mostrar senha"
                  className="eye-icon"
                />
              </button>
            </div>
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Próximo'}
            </button>
          </form>
        </div>

        <div className="auth-right">
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
