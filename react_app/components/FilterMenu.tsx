import React, { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { axiosChegadosApi } from './api'
import { redirect } from 'next/navigation'

type FilterMenuProps = {
  isOpen: boolean
  isClosing: boolean
  onClose: () => void
  menuTitle: string
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedRating: number
  setSelectedRating: (value: number) => void
  onApplyFilters: () => void
  categories: string[]
  selectedEvent?: {
    id: number
    nome_evento: string
    nota: string
    organizador: string
    data_dias: string
    horario: string
    local: string
    descricao?: string
    link: string
  }
  onConfirmPresence: (event: any) => void
}

export default function FilterMenu({
  isOpen,
  isClosing,
  onClose,
  menuTitle,
  selectedCategory,
  setSelectedCategory,
  selectedRating,
  setSelectedRating,
  onApplyFilters,
  categories,
  selectedEvent,
  onConfirmPresence
}: FilterMenuProps) {
  const shareRef = useRef(null)
  const [shareOpen, setShareOpen] = useState(false)

  const { data: session } = useSession()
  const user = session?.user as Session['user'] & { id?: number }

  if (!isOpen) return null

  if (menuTitle !== 'Filtros') {
    if (!selectedEvent) {
      return (
        <div className="filter-menu-overlay" onClick={onClose}>
          <aside className={`filter-menu ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
            <p>Selecione um evento para ver os detalhes.</p>
          </aside>
        </div>
      )
    }

    const reviewCount = Math.floor(Math.random() * 200) + 10
    const interestedCount = Math.floor(Math.random() * 1500) + 50

    return (
      <div className="filter-menu-overlay" onClick={onClose}>
        <aside className={`filter-menu event-details ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
          <header className="filter-menu-header">
            <div className="header-title-location">
              <h2>{menuTitle}</h2>
              <span>Fortaleza</span>
            </div>
            <button onClick={onClose} className="close-button">
              &times;
            </button>
          </header>

          <div className="event-details-content share-image-container" ref={shareRef}>
            <div className="details-image-container">
              <img src={selectedEvent.photo} alt={selectedEvent.nome_evento} className="details-image" />
              <div className="details-rating">
                <img src="/imgs/estrelagold.png" alt="Ícone de estrela" />
                <span>{parseFloat(selectedEvent.nota).toFixed(1)}</span>
              </div>
              <div className="details-header">
                <p className="details-organizer">{selectedEvent.organizador}</p>
                <h3 className="details-event-name">{selectedEvent.nome_evento}</h3>
              </div>
            </div>

            <ul className="details-list">
              <li>
                <strong>Data & Horário:</strong> {selectedEvent.data_dias} às {selectedEvent.horario}
              </li>
              <li>
                <strong>Local:</strong> {selectedEvent.local}
              </li>
              <li>
                <strong>Avaliação:</strong> {parseFloat(selectedEvent.nota).toFixed(1)} ({reviewCount} avaliações)
              </li>
              <li>
                <strong>Interessados:</strong> {interestedCount} pessoas
              </li>
            </ul>

            <div className="details-description">
              <h4>Sobre o evento</h4>
              <p>
                {selectedEvent.descricao ||
                  'Descrição do evento não disponível. Junte-se a nós para uma experiência incrível!'}
              </p>
            </div>
          </div>

          <div className="details-actions">
            <button
              className="primary-action-button"
              onClick={() => {
                window.open(selectedEvent.link, '_blank', 'noopener,noreferrer')
              }}
            >
              Confirmar presença
            </button>

            <button
              className="secondary-action-button"
              onClick={() => {
                const shareText = `Confira o evento: ${selectedEvent.nome_evento} - ${selectedEvent.link}`
                if (navigator.share) {
                  navigator.share({
                    title: selectedEvent.nome_evento,
                    text: shareText,
                    url: selectedEvent.link
                  })
                } else {
                  navigator.clipboard.writeText(shareText)
                  alert('Link copiado para área de transferência!')
                }
              }}
            >
              Compartilhar evento
            </button>

            <button
              className="tertiary-action-button"
              onClick={() => {
                if (onConfirmPresence && selectedEvent) {
                  onConfirmPresence(selectedEvent)
                }
              }}
            >
              Salvar nos meus eventos
            </button>
          </div>
        </aside>
      </div>
    )
  }

  const ratings = [1, 2, 3, 4, 5]

  return (
    <div className="filter-menu-overlay" onClick={onClose}>
      <aside className={`filter-menu ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
        <header className="filter-menu-header">
          <h2>{menuTitle}</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </header>

        <div className="filter-menu-content">
          <section className="filter-section">
            <h3>Categorias de Evento</h3>
            <div className="tags-container">
              {categories.map(tag => (
                <button
                  key={tag}
                  className={`tag-button ${selectedCategory === tag ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === tag ? 'Todos' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="filter-section">
            <h3>Avaliação</h3>
            <div className="rating-container">
              {ratings.map(star => (
                <button
                  key={star}
                  className={`rating-button ${selectedRating === star ? 'active' : ''}`}
                  onClick={() => setSelectedRating(selectedRating === star ? 0 : star)}
                >
                  <img src="/imgs/estrelagold.png" alt="Ícone de estrela" />
                  {star}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="filter-menu-footer">
          <button className="primary-filter-button" onClick={onApplyFilters}>
            Filtrar eventos
          </button>
        </footer>
      </aside>
    </div>
  )
}
