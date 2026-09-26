import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import Sidebar from '../components/Sidebar'
import ThemeToggleButton from '../components/ThemeToggleButton'
import { useTheme } from '../contexts/ThemeContext'
import LogoutConfirmationModal from '../components/LogoutConfirmationModal'

import ConfirmationModal from '../components/ConfirmationModal'

import FilterMenu from '../components/FilterMenu'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { axiosChegadosApi } from 'components/api'

interface Event {
  id: number
  nome_evento: string
  imagem: string
  nota: number
  data_dias: string
  horario: string
  local: string
  categoria_primaria: string
  categoria_secundaria: string
  organizador: string
  descricao: string
  link: string
}

interface BackendEvent {
  id: number
  name: string
  category: string
  location: string
  scheduled_begin_at: string
  scheduled_end_at: string
  photo: string
  link: string
  created_at: string
  updated_at: string
}

export default function FeedPage() {
  const { data: session, status } = useSession()

  const [events, setEvents] = useState<Event[]>([])
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('Mais populares')
  const popularSliderRef = useRef(null)

  const [searchTerm, setSearchTerm] = useState('')
  const { toggleTheme } = useTheme()

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false)

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false)
  const [isAnimatingOut, setAnimatingOut] = useState(false)
  const [menuTitle, setMenuTitle] = useState('Filtros')

  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedRating, setSelectedRating] = useState(0)

  const [isFilteredView, setIsFilteredView] = useState(false)

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([])

  const openSideMenu = (title: string) => {
    setMenuTitle(title)
    setFilterMenuOpen(true)
  }


  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    openSideMenu('Detalhes do evento')
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const handleCloseMenu = () => {
    setAnimatingOut(true)
    setTimeout(() => {
      setFilterMenuOpen(false)
      setAnimatingOut(false)
    }, 300)
  }

  const handleThemeToggle = () => {
  }

  const handleConfirmPresence = async (event: Event) => {

    if (!session?.accessToken) {
      console.error('Usuário não autenticado')
      alert('Você precisa estar logado para confirmar presença.')
      return
    }

    try {
      const response = await axiosChegadosApi.post(
        '/participations/',
        {
          event: event.id,
          user: session.user.id
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )


      handleCloseMenu()
      setConfirmationModalOpen(true)
    } catch (error: any) {

      let errorMessage = 'Não foi possível confirmar sua presença. Tente novamente mais tarde.'

      if (error.response?.status === 409) {
        errorMessage = 'Você já confirmou presença para este evento.'
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique se o evento existe.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Sessão expirada. Faça login novamente.'
      }
    }
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.accessToken) {
      router.push('/login')
      return
    }

    const fetchEvents = async () => {
      try {
        const response = await axiosChegadosApi.get('/social_events', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.status !== 200) {
          return
        }

        const data: BackendEvent[] = response.data.results


        const transformedEvents: Event[] = data.map((event: BackendEvent, idx: number) => ({
          id: event.id,
          nome_evento: event.name,
          photo: event.photo || '/imgs/cinema.jpg',
          nota: Math.floor(Math.random() * 2) + 4,
          data_dias: event.scheduled_begin_at ? new Date(event.scheduled_begin_at).toLocaleDateString('pt-BR') : '',
          horario: '19:00',
          local: event.location,
          categoria_primaria: event.category || 'Geral',
          categoria_secundaria: '',
          organizador: 'Chegados',
          descricao: event.name,
          link: event.link || '#'
        }))

        const sortedPopularEvents = [...transformedEvents].sort(
          (a, b) => parseFloat(b.nota.toString()) - parseFloat(a.nota.toString())
        )
        setEvents(transformedEvents)
        setDisplayedEvents(sortedPopularEvents)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
        try {
          const fallbackResponse = await axiosChegadosApi.get('/eventos_sympla.json')
          const data = fallbackResponse.data

          const eventsFromJSON: Event[] = data.events.map((event: any, idx: number) => ({
            id: idx + 1,
            nome_evento: event.title,
            photo: event.img_url || '/imgs/cinema.jpg',
            nota: Math.floor(Math.random() * 2) + 4,
            data_dias: event.date.split('•')[0]?.trim() ?? '',
            horario: event.date.split('•')[1]?.split('>')[0]?.trim() ?? '',
            local: event.location,
            categoria_primaria: event.categoria,
            categoria_secundaria: '',
            organizador: 'Sympla',
            descricao: event.description,
            link: event.link
          }))

          const sortedPopularEvents = [...eventsFromJSON].sort(
            (a, b) => parseFloat(b.nota.toString()) - parseFloat(a.nota.toString())
          )
          setEvents(eventsFromJSON)
          setDisplayedEvents(sortedPopularEvents)
        } catch (fallbackError) {
          console.error('Erro ao carregar eventos de fallback:', fallbackError)
        }
      }
    }

    fetchEvents()
  }, [session, status, router])

  const parseDate = (dataString: string) => {
    try {
      const [day, monthStr, rest] = dataString.split(' ')
      const year = rest?.split('-')?.[1]?.trim()
      const month = {
        jan: 0,
        fev: 1,
        mar: 2,
        abr: 3,
        mai: 4,
        jun: 5,
        jul: 6,
        ago: 7,
        set: 8,
        out: 9,
        nov: 10,
        dez: 11
      }[monthStr.toLowerCase()]
      return new Date(parseInt(year || '2024'), month || 0, parseInt(day))
    } catch (err) {
      return new Date()
    }
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingEvents = events.filter(event => parseDate(event.data_dias).getTime() >= today.getTime())
  upcomingEvents.sort((a, b) => parseDate(a.data_dias).getTime() - parseDate(b.data_dias).getTime())
  const featuredEvents = upcomingEvents.slice(0, 3)
  const loopedFeaturedEvents =
    featuredEvents.length > 0 && featuredEvents.length < 5 ? [...featuredEvents, ...featuredEvents] : featuredEvents

  const categories = [
    'Todos os eventos',
    'Mais populares',
    ...Array.from(new Set(events.flatMap(event => [event.categoria_primaria, event.categoria_secundaria])))
  ]

  const mainSliderSettings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '120px',
    slidesToShow: 1,
    speed: 500,
    arrows: false,
    dots: false,
    focusOnSelect: true,
    autoplay: true,
    pauseOnHover: true,
    afterChange: (newIndex: number) => setActiveSlideIndex(newIndex)
  }

  const handleApplySearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      return
    }


    const searchResult = events.filter(
      event =>
        event.nome_evento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizador.toLowerCase().includes(searchTerm.toLowerCase())
    )


    setDisplayedEvents(searchResult)

    setIsFilteredView(true)
  }

  const applyFilters = () => {

    let filteredEvents = [...events]

    if (selectedCategory === 'Mais populares') {
      filteredEvents.sort((a, b) => parseFloat(b.nota.toString()) - parseFloat(a.nota.toString()))
    } else if (selectedCategory !== 'Todos os eventos' && selectedCategory !== 'Todos') {
      filteredEvents = filteredEvents.filter(
        event => event.categoria_primaria === selectedCategory || event.categoria_secundaria === selectedCategory
      )
    }

    if (selectedRating > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const nota = parseFloat(event.nota.toString())
        if (selectedRating === 5) {
          return nota === 5
        }
        const lowerBound = selectedRating
        const upperBound = selectedRating + 1
        return nota >= lowerBound && nota < upperBound
      })
    }

    setDisplayedEvents(filteredEvents)
    setIsFilteredView(true)
    handleCloseMenu()
  }

  const clearFilters = () => {
    setSelectedCategory('Todos')
    setSelectedRating(0)
    setIsFilteredView(false)

    setSearchTerm('')

    const sortedPopularEvents = [...events].sort(
      (a, b) => parseFloat(b.nota.toString()) - parseFloat(a.nota.toString())
    )
    setDisplayedEvents(sortedPopularEvents)
  }

  const popularSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    if (category === 'Todos os eventos') {
      setDisplayedEvents(events)
    } else if (category === 'Mais populares') {
      const sorted = [...events].sort((a, b) => parseFloat(b.nota.toString()) - parseFloat(a.nota.toString()))
      setDisplayedEvents(sorted)
    } else {
      const filtered = events.filter(
        event => event.categoria_primaria === category || event.categoria_secundaria === category
      )
      setDisplayedEvents(filtered)
    }
  }

  return (
    <>
      <Head>
        <title>Toggo - Feed</title>
      </Head>

      <div className="page-layout page-with-fixed-sidebar">
        <Sidebar activeItem="Eventos" onSignOutClick={() => setLogoutModalOpen(true)} />

        <main className="main-content">
          <header className="top-bar">
            <h2 className="top-bar-title">Selecionar localização</h2>

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
          <form className="search-filter-section" onSubmit={handleApplySearch}>
            <div className="search-box">
              <img src="/imgs/find.png" alt="Buscar" className="search-icon" onClick={handleApplySearch} />
              <input
                type="text"
                placeholder="Busque por nome, local ou organizador..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <button type="button" className="filter-button" onClick={() => openSideMenu('Filtros')}>
              <img src="/imgs/filter.png" alt="Filtros" className="filter-icon" />
              Filtros
            </button>
          </form>
          {isFilteredView ? (
            <div className="filtered-results-view">
              <div className="section-header">
                <h2>Resultados do Filtro</h2>
                <button className="clear-filters-button" onClick={clearFilters}>
                  Limpar filtros
                </button>
              </div>
              {displayedEvents.length > 0 ? (
                <div className="event-cards-grid">
                  {displayedEvents.map(event => (
                    <div key={event.id} className="small-event-card" onClick={() => handleEventClick(event)}>
                      <div className="event-rating">{event.nota.toFixed(1)}</div>
                      <h4>{event.nome_evento}</h4>
                      <p className="event-description">
                        Organizado por: <strong>{event.organizador}</strong>
                      </p>
                      <p className="event-details">
                        <span>
                          {event.data_dias} às {event.horario}
                        </span>
                        <br />
                        <span>{event.local}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results-message">
                  <p>Nenhum evento encontrado para os filtros selecionados.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <section className="event-of-day-carousel-section">
                <Slider {...mainSliderSettings}>
                  {loopedFeaturedEvents.map((event, index) => (
                    <div
                      key={`${event.id}-${index}`}
                      onClick={() => {
                        if (index === activeSlideIndex) {
                          handleEventClick(event)
                        }
                      }}
                    >
                      <div className="event-of-day-card">
                        <div className="card-content">
                          <h3>{event.categoria_primaria}</h3>
                          <h2>{event.nome_evento}</h2>
                          <p className="event-date-time">
                            <span>{event.data_dias}</span> às <span>{event.horario}</span>
                          </p>
                          <p className="event-location">
                            Local: <span>{event.local}</span>
                          </p>
                        </div>
                        <div className="card-image">
                          <img
                            src={event.photo}
                            alt={event.nome_evento}
                            loading="lazy"
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.src = '/imgs/cinema.jpg'
                            }}
                            onLoad={e => {
                              const target = e.target as HTMLImageElement
                              target.style.opacity = '1'
                            }}
                            style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </section>

              <section className="category-navigation">
                <div className="category-nav">
                  {categories.slice(0, 7).map(category => (
                    <button
                      key={category}
                      className={`category-button ${activeCategory === category ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </section>

              <section className="event-list-section">
                <div className="section-header">
                  <h2>{activeCategory}</h2>
                  <div className="nav-arrows">
                    <button className="arrow-button" onClick={() => popularSliderRef.current?.slickPrev()}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/imgs/arrow-left.png" alt="Anterior" />
                    </button>
                    <button className="arrow-button" onClick={() => popularSliderRef.current?.slickNext()}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/imgs/arrow-right.png" alt="Próximo" />
                    </button>
                  </div>
                </div>
                <Slider ref={popularSliderRef} {...popularSliderSettings}>
                  {displayedEvents.map(event => (
                    <div key={event.id} className="small-event-card" onClick={() => handleEventClick(event)}>
                      <div className="event-rating">{event.nota.toFixed(1)}</div>
                      <h4>{event.nome_evento}</h4>
                      <p className="event-description">
                        Organizado por: <strong>{event.organizador}</strong>
                      </p>
                      <p className="event-details">
                        <span>
                          {event.data_dias} às {event.horario}
                        </span>
                        <br />
                        <span>{event.local}</span>
                      </p>
                    </div>
                  ))}
                </Slider>
              </section>
            </>
          )}
        </main>
      </div>
      <FilterMenu
        isOpen={isFilterMenuOpen}
        isClosing={isAnimatingOut}
        onClose={handleCloseMenu}
        menuTitle={menuTitle}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        onApplyFilters={applyFilters}
        categories={categories}
        selectedEvent={selectedEvent}
        onConfirmPresence={handleConfirmPresence}
      />
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleSignOut}
      />
      <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} />
      <ThemeToggleButton onToggle={toggleTheme} />
    </>
  )
}
