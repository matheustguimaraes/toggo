
import React from 'react';

export default function ConfirmationModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>🎉 Presença confirmada!</h2>
                <p>Você está oficialmente dentro desse evento! Agora é só chegar no local, se conectar e aproveitar cada momento.</p>
                <button className="primary-button" onClick={onClose}>
                    Entendi
                </button>
            </div>
        </div>
    );
}