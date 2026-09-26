
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface SidebarProps {
  activeItem: string
  onSignOutClick: () => void
}

export default function Sidebar({ activeItem, onSignOutClick }: SidebarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const userName = session?.user?.name || session?.user?.username || 'Usuário'
  const userEmail = session?.user?.email || ''

  return (
    <aside className="sidebar">
      <div className="logo">
        <a onClick={() => router.push('/feed')} style={{ cursor: 'pointer' }}>
          <img src="/imgs/mini-logo.png" alt="Toggo Logo" />
        </a>
      </div>

      <div className="profile-section">
        <img src="/imgs/profile_pic.png" alt="Profile Picture" className="profile-pic" />
        <div className="profile-info">
          <span>{userName}</span>
          <a onClick={() => router.push('/profile')} style={{ cursor: 'pointer' }}>
            Ver perfil
          </a>
        </div>
      </div>

      <nav className="menu-nav">
        <ul>
          <Link href="/feed" passHref>
            <li className={`menu-item ${activeItem === 'Eventos' ? 'active' : ''}`}>
              <img src="/imgs/feed.png" alt="Eventos" />
              Eventos
            </li>
          </Link>

          <Link href="/meus-eventos" passHref>
            <li className={`menu-item ${activeItem === 'Meus Eventos' ? 'active' : ''}`}>
              <img src="/imgs/starfull.png" alt="Eventos" />
              Meus Eventos
            </li>
          </Link>

          <Link href="/historico-eventos" passHref>
            <li className={`menu-item ${activeItem === 'Histórico de eventos' ? 'active' : ''}`}>
              <img src="/imgs/history.png" alt="Histórico de eventos" />
              Histórico de eventos
            </li>
          </Link>

          <Link href="/ajuda" passHref>
            <li className={`menu-item ${activeItem === 'Ajuda' ? 'active' : ''}`}>
              <img src="/imgs/ajuda.png" alt="Ajuda" />
              Ajuda
            </li>
          </Link>
        </ul>
      </nav>

      <div className="menu-item logout-item" onClick={onSignOutClick}>
        <img src="/imgs/logout.png" alt="Sair" />
        Sair
      </div>
    </aside>
  )
}
