import React from 'react';

export default function MyEventCard({ event, onDetailsClick }) {
  const reviewCount = Math.floor(Math.random() * 200) + 10;

  const handleSaveEvent = async () => {
    try {
      const res = await fetch('/api/save-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (res.ok) {
        alert('Evento salvo com sucesso!');
      } else {
        const error = await res.json();
        console.error('Erro ao salvar evento:', error);
        alert('Erro ao salvar evento.');
      }
    } catch (err) {
      console.error('Erro de rede:', err);
      alert('Erro de rede ao salvar evento.');
    }
  };

  return (
    <div className="my-event-card">
      {event.imagem && (
        <img src={event.imagem} alt={event.nome_evento} className="my-event-image" />
      )}

      <div className="my-event-details">
        <div className="my-event-header">
          <h3 className="my-event-title">{event.nome_evento}</h3>
          <div className="my-event-category">
            <span className="category-tag">{event.categoria_primaria}</span>
            {event.categoria_secundaria && (
              <span className="category-tag secondary">{event.categoria_secundaria}</span>
            )}
          </div>
        </div>

        <div className="my-event-meta">
          <div className="my-event-info">
            <div className="my-event-rating">
              <img src="/imgs/estrelagold.png" alt="Estrela" />
              <span className="rating-value">{parseFloat(event.nota).toFixed(1)}</span>
              <span className="review-count">({reviewCount} avaliações)</span>
            </div>

            <div className="info-row">
              <span className="info-label">📅 Data:</span>
              <span className="info-value">{event.data_dias}</span>
            </div>
            <div className="info-row">
              <span className="info-label">🕒 Horário:</span>
              <span className="info-value">{event.horario}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📍 Local:</span>
              <span className="info-value">{event.local}</span>
            </div>
            <div className="info-row">
              <span className="info-label">👤 Organizador:</span>
              <span className="info-value">{event.organizador}</span>
            </div>
            <div className="info-row">
              <span className="info-label">🏷️ Categoria:</span>
              <span className="info-value">{event.categoria_primaria}</span>
            </div>
          </div>
        </div>

        {event.descricao && (
          <div className="my-event-description">
            <p className="description-text">{event.descricao}</p>
          </div>
        )}

        {event.confirmed_at && (
          <div className="my-event-confirmation">
            <span className="confirmation-badge">✅ Confirmado em {new Date(event.confirmed_at).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      <div className="my-event-buttons">
        <button className="my-event-button primary" onClick={onDetailsClick}>
          Ver detalhes
        </button>
        {/* <button className="my-event-button secondary" onClick={handleSaveEvent}>
          Salvar evento
        </button> */}
      </div>
    </div>
  );
}
