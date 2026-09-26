import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'

import Sidebar from '../components/Sidebar'
import MyEventCard from '../components/MyEventCard'
import FilterMenu from '../components/FilterMenu'
import ThemeToggleButton from '../components/ThemeToggleButton'
import LogoutConfirmationModal from '../components/LogoutConfirmationModal'

import { useTheme } from '../contexts/ThemeContext'
import { axiosChegadosApi } from '../components/api'

import events from '../data/events.json'

interface Event {
  id: number
  nome_evento: string
  imagem?: string
  nota: number
  data_dias: string
  horario: string
  local: string
  categoria_primaria: string
  categoria_secundaria: string
  organizador: string
  descricao: string
  link: string
  confirmed_at?: string
}

interface Participation {
  id: number
  event: {
    id: number
    name: string
    category: string
    location: string
    scheduled_begin_at: string
    scheduled_end_at: string
    photo?: string
    created_at: string
    updated_at: string
  }
  confirmed_at: string
  user_rating?: number
}

export default function MeusEventosPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toggleTheme } = useTheme()

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false)
  const [isAnimatingOut, setAnimatingOut] = useState(false)
  const [menuTitle, setMenuTitle] = useState('')
  const [userEvents, setUserEvents] = useState<Event[]>([])
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)


  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const openSideMenu = (title: string) => {
    setMenuTitle(title)
    setFilterMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setAnimatingOut(true)
    setTimeout(() => {
      setFilterMenuOpen(false)
      setAnimatingOut(false)
    }, 300)
  }

  const handleDetailsClick = (event: Event) => {
    setSelectedEvent(event)
    openSideMenu('Detalhes do evento')
  }

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (session?.user?.id && session?.accessToken) {
          const response = await axiosChegadosApi.get(`/participations_events/?user=${session.user.id}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          })

          const participations: Participation[] = response.data.results || response.data
          const userEvents: Event[] = participations.map(participation => ({
            id: participation.event.id,
            nome_evento: participation.event.name,
            imagem: participation.event.photo || '/imgs/cinema.jpg',
            nota: Math.floor(Math.random() * 2) + 4,
            data_dias: participation.event.scheduled_begin_at
              ? new Date(participation.event.scheduled_begin_at).toLocaleDateString('pt-BR')
              : '',
            horario: '19:00',
            local: participation.event.location,
            categoria_primaria: participation.event.category || 'Geral',
            categoria_secundaria: '',
            organizador: 'Chegados',
            descricao: participation.event.name,
            link: participation.event.photo || '#',
            confirmed_at: participation.confirmed_at
          }))

          setUserEvents(userEvents)
        } else {
          const savedIds: number[] = JSON.parse(localStorage.getItem('savedEvents') || '[]')
          const filtered: Event[] = events.filter((e: any) => savedIds.includes(e.id))
          setUserEvents(filtered)
        }
      } catch (err) {
        console.error('Erro ao carregar eventos salvos:', err)
        const savedIds: number[] = JSON.parse(localStorage.getItem('savedEvents') || '[]')
        const filtered: Event[] = events.filter((e: any) => savedIds.includes(e.id))
        setUserEvents(filtered)
      }
    }

    fetchUserEvents()
  }, [session])

  return (
    <>
      <Head>
        <title>Toggo - Meus Eventos</title>
      </Head>

      <div className="page-layout page-with-flex-sidebar">
        <Sidebar activeItem="Meus Eventos" onSignOutClick={() => setLogoutModalOpen(true)} />

        <main className="my-events-main-content">
          <header className="my-events-top-bar">
            <h1>Meus eventos</h1>
            <div className="top-bar-actions">
              <div className="location-selector">
                <img src="/imgs/map-pin.png" alt="Location Pin" className="icon" />
                <span className="current-location">Parquelândia, Fortaleza</span>
                <img src="/imgs/chevron-down.png" alt="Arrow Down" className="icon" />
              </div>
              <div className="notifications">
                <img src="/imgs/bell.png" alt="Notifications" className="icon" />
                <span>Notificações</span>
              </div>
            </div>
          </header>

          <div className="my-events-list">
            {userEvents.length ? (
              userEvents.map(event => (
                <MyEventCard key={event.id} event={event} onDetailsClick={() => handleDetailsClick(event)} />
              ))
            ) : (
              <p>Você ainda não salvou nenhum evento.</p>
            )}
          </div>
        </main>
      </div>

      <FilterMenu
        isOpen={isFilterMenuOpen}
        isClosing={isAnimatingOut}
        onClose={handleCloseMenu}
        menuTitle={menuTitle}
        selectedEvent={selectedEvent}
      />

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleSignOut}
      />

      <ThemeToggleButton onToggle={toggleTheme} />
    </>
  )
}
