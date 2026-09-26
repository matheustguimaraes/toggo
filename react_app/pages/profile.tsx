import Head from 'next/head'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ThemeToggleButton from '../components/ThemeToggleButton'
import { useTheme } from '../contexts/ThemeContext'
import LogoutConfirmationModal from '../components/LogoutConfirmationModal'
import { Session } from 'next-auth'
import { axiosChegadosApi } from '../components/api'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toggleTheme } = useTheme()
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return

      if (!session?.accessToken) {
        router.push('/login')
        return
      }

      try {
        setLoading(true)
        const username = session.user?.username || session.user?.name
        const response = await axiosChegadosApi.get(`/users?username=${username}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        const userDataFromResponse = response.data.results?.[0] || response.data
        setUserData(userDataFromResponse)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError('Erro ao carregar dados do usuário')

        if (session?.user) {
          setUserData(session.user)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [session, status, router])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  if (!session || !userData) {
    return null
  }

  const user = userData

  return (
    <>
      <Head>
        <title>Perfil - Chegados</title>
        <meta name="description" content="Seu perfil de usuário" />
      </Head>

      <div className="page-layout page-with-fixed-sidebar">
        <Sidebar activeItem="Perfil" onSignOutClick={() => setLogoutModalOpen(true)} />

        <main className="main-content">
          <header className="top-bar">
            <h2 className="top-bar-title">Meu Perfil</h2>
            <div className="top-bar-actions">
              <ThemeToggleButton />
            </div>
          </header>

          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <img src="/imgs/profile_pic.png" alt="Foto de perfil" />
                </div>
                <div className="profile-info">
                  <h2>{user.name || user.username || 'Usuário'}</h2>
                  <p className="profile-email">{user.email || 'Email não informado'}</p>
                </div>
              </div>

              <div className="profile-details">
                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Informações Básicas</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Nome de usuário:</label>
                      <span>{user.username || 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nome:</label>
                      <span>{user.first_name || 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Sobrenome:</label>
                      <span>{user.last_name || 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{user.email || 'Não informado'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Informações da Conta</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID do usuário:</label>
                      <span>{user.id || 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status da conta:</label>
                      <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Tipo de usuário:</label>
                      <span>{user.is_superuser ? 'Administrador' : user.is_staff ? 'Staff' : 'Usuário comum'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Data de registro:</label>
                      <span>{user.date_joined ? formatDate(user.date_joined) : 'Não informado'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Último login:</label>
                      <span>{user.last_login ? formatDate(user.last_login) : 'Não informado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleSignOut}
      />
    </>
  )
}
