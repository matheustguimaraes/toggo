
import React from 'react';

export default function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logout-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tem certeza que deseja sair?</h2>
        <p>
          Ao sair, você não poderá acessar seus eventos salvos,
          recomendações ou histórico até fazer login novamente.
        </p>
        
        <button className="primary-button" onClick={onClose}>
          Não, quero continuar logado
        </button>
        
        <button className="secondary-button confirm-logout" onClick={onConfirm}>
          Sim, desejo sair
        </button>
      </div>
    </div>
  );
}